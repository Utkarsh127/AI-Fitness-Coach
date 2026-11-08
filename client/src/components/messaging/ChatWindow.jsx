/**
 * @component ChatWindow
 * @description The active chat view, handling message listing, inputs, typing, and read receipts.
 */

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowLeft, HiPaperAirplane, HiPhotograph, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { fetchMessages, sendMessage, markMessagesAsReadLocal, setTyping, clearTyping } from '../../store/slices/messagingSlice.js';
import socketClient from '../../sockets/socketClient.js';
import { Spinner } from '../common/Loader.jsx';
import MessageBubble from './MessageBubble.jsx';
import ForwardModal from './ForwardModal.jsx';

const EMPTY_ARRAY = [];

const ChatWindow = ({ conversation, onBack, onlineUsers }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ─── ALL HOOKS MUST BE AT THE TOP — BEFORE ANY CONDITIONAL RETURN ──────────

  // Read message list and typing status for whatever conversation is currently
  // active (or empty arrays/undefined when conversation is null).
  const conversationId = conversation?._id ?? null;

  const messages = useSelector(
    state => (conversationId ? state.messaging.messagesByConversation[conversationId] ?? EMPTY_ARRAY : EMPTY_ARRAY)
  );
  const typingUserId = useSelector(
    state => (conversationId ? state.messaging.typingStatus[conversationId] : undefined)
  );

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [messageToForward, setMessageToForward] = useState(null);
  const messagesEndRef = useRef(null);

  // ─── Socket / fetch effect — guarded internally, safe to be unconditional ──
  useEffect(() => {
    if (!conversation || !conversation._id || conversation._id === 'new') return;

    dispatch(fetchMessages({ conversationId: conversation._id, params: { limit: 50, page: 1 } }));

    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit('joinConversation', conversation._id);

      // Mark as read
      const unreadIds = messages
        .filter(m => m && m.readBy && !m.readBy.find(r => r.user === user?._id))
        .map(m => m._id);
      if (unreadIds.length > 0) {
        socket.emit('markAsRead', { conversationId: conversation._id, messageIds: unreadIds });
        dispatch(markMessagesAsReadLocal({
          conversationId: conversation._id,
          messageIds: unreadIds,
          readBy: user?._id,
          readAt: new Date().toISOString(),
        }));
      }
    }

    return () => {
      const s = socketClient.getSocket();
      if (s) s.emit('leaveConversation', conversation._id);
    };
  }, [conversation, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Scroll-to-bottom effect ────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ─── Derived values (not hooks — safe to compute after all hooks) ───────────
  const isGroup = conversation?.type === 'group';
  const otherUser = isGroup
    ? null
    : (conversation?.participants?.find(p => p._id !== user?._id) ?? conversation?.participants?.[0]);
  const name = isGroup ? conversation?.groupName : otherUser?.name;
  const typingUser = typingUserId
    ? conversation?.participants?.find(p => p._id === typingUserId)
    : null;

  const isOnline = !isGroup && onlineUsers?.includes(otherUser?._id);

  console.log('ChatWindow presence check:', {
    isGroup,
    otherUserId: otherUser?._id,
    participants: conversation?.participants,
    onlineUsers,
    isOnline
  });

  // ─── Event handlers ─────────────────────────────────────────────────────────
  const handleTyping = (e) => {
    setContent(e.target.value);
    const socket = socketClient.getSocket();
    if (socket && conversation) {
      if (e.target.value) {
        socket.emit('typing', { conversationId: conversation._id });
      } else {
        socket.emit('stopTyping', { conversationId: conversation._id });
      }
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 5MB).`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles].slice(0, 4));
    }
    
    // Reset input so the same file can be selected again if removed
    e.target.value = null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    if (!conversation || !conversation._id || conversation._id === 'new') return;

    setIsSending(true);

    const formData = new FormData();
    formData.append('conversationId', conversation._id);
    formData.append('content', content);
    images.forEach(img => formData.append('attachments', img));

    const resultAction = await dispatch(sendMessage(formData));

    if (sendMessage.rejected.match(resultAction)) {
      toast.error(resultAction.payload || 'Failed to send message.');
    } else {
      setContent('');
      setImages([]);
    }

    setIsSending(false);

    const socket = socketClient.getSocket();
    if (socket) socket.emit('stopTyping', { conversationId: conversation._id });
  };

  // ─── Conditional render — AFTER all hooks ───────────────────────────────────
  if (!conversation || !conversation._id || conversation._id === 'new') {
    return (
      <div className="hidden md:flex h-full w-full items-center justify-center flex-col bg-surface/50 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
          <HiPaperAirplane className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
        <p className="text-slate-400">Select a conversation or start a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-surface">

      {/* Header */}
      <div className="h-16 px-4 flex items-center gap-4 bg-surface-border/20 border-b border-surface-border shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 border border-white/10 shadow-[0_0_10px_rgba(139,92,246,0.15)] overflow-hidden flex items-center justify-center shrink-0">
            {isGroup ? (
              conversation.groupImage
                ? <img src={conversation.groupImage} alt={name} className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-sm">{name?.charAt(0)}</span>
            ) : (
              otherUser?.profilePicture
                ? <img src={otherUser.profilePicture} alt={name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
                : <span className="text-white font-bold text-sm">{name?.charAt(0)?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-white">{name}</h2>
            {typingUser ? (
              <p className="text-xs text-brand-400 font-medium">typing...</p>
            ) : isGroup ? (
              <p className="text-xs text-slate-400">{conversation.participants?.length ?? 0} members</p>
            ) : isOnline ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-slate-300 font-medium">Online</p>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <p className="text-xs text-slate-400 font-medium">Offline</p>
              </div>
            )}
          </div>
        </div>
        </div>
        <button onClick={onBack} className="hidden md:flex p-2 text-slate-400 hover:text-white transition-colors" title="Close Chat">
          <HiX className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {messages
          .filter(msg => msg && msg._id)
          .map(msg => (
            <MessageBubble 
              key={msg._id} 
              message={msg} 
              isOwn={msg.sender?._id === user?._id} 
              onForward={(m) => setMessageToForward(m)}
            />
          ))}
      </div>

      {/* Image Preview Area */}
      {images.length > 0 && (
        <div className="px-4 py-2 border-t border-surface-border bg-surface flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-surface-border">
              <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white flex items-center justify-center"
              >
                <HiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-surface-border shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="chat-image-upload"
              onChange={handleImageSelect}
              disabled={images.length >= 4}
            />
            <label htmlFor="chat-image-upload" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white bg-surface-border/50 rounded-full cursor-pointer transition-colors">
              <HiPhotograph className="w-6 h-6" />
            </label>
          </div>

          <div className="flex-1 bg-surface-border/50 rounded-2xl overflow-hidden flex items-center px-4 min-h-[48px]">
            <textarea
              placeholder="Type a message..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 max-h-32 min-h-[48px] text-white placeholder:text-slate-500"
              value={content}
              onChange={handleTyping}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={1}
            />
          </div>

          <button
            type="submit"
            disabled={isSending || (!content.trim() && images.length === 0)}
            className="w-12 h-12 flex items-center justify-center bg-brand-500 hover:bg-brand-400 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSending ? <Spinner size="sm" /> : <HiPaperAirplane className="w-5 h-5 translate-x-0.5" />}
          </button>
        </form>
      </div>

      {messageToForward && (
        <ForwardModal 
          messageToForward={messageToForward} 
          onClose={() => setMessageToForward(null)} 
        />
      )}
    </div>
  );
};

export default ChatWindow;
