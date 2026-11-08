import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiX, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { sendMessage } from '../../store/slices/messagingSlice.js';
import { Spinner } from '../common/Loader.jsx';

const ForwardModal = ({ messageToForward, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const conversations = useSelector(state => state.messaging.conversations);
  
  const [sendingTo, setSendingTo] = useState({});

  const handleForward = async (conversationId) => {
    setSendingTo(prev => ({ ...prev, [conversationId]: 'sending' }));

    const formData = new FormData();
    formData.append('conversationId', conversationId);
    if (messageToForward.content) {
      formData.append('content', messageToForward.content);
    }
    formData.append('isForwarded', 'true');
    
    if (messageToForward.attachments?.length > 0) {
      messageToForward.attachments.forEach(url => {
        formData.append('forwardedAttachments[]', url);
      });
    }

    try {
      const resultAction = await dispatch(sendMessage(formData));
      if (sendMessage.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to forward message');
        setSendingTo(prev => ({ ...prev, [conversationId]: 'error' }));
      } else {
        toast.success('Message forwarded');
        setSendingTo(prev => ({ ...prev, [conversationId]: 'sent' }));
        setTimeout(() => onClose(), 1000); // Auto-close after a moment of success
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      setSendingTo(prev => ({ ...prev, [conversationId]: 'error' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface-border w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-border/20">
          <h3 className="text-lg font-bold text-white">Share Message</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-surface-border/50">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview (Optional but nice) */}
        <div className="p-4 bg-surface-border/10 border-b border-surface-border">
          <p className="text-xs font-medium text-brand-400 mb-1">Preview</p>
          <div className="flex items-center gap-3">
            {messageToForward.attachments?.length > 0 && (
              <img src={messageToForward.attachments[0]} alt="preview" className="w-10 h-10 object-cover rounded-md" />
            )}
            <p className="text-sm text-slate-300 truncate">
              {messageToForward.content || 'Image attachment'}
            </p>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No conversations available</p>
          ) : (
            conversations.map(conv => {
              const isGroup = conv.type === 'group';
              const otherUser = isGroup 
                ? null 
                : conv.participants?.find(p => p._id !== user._id);
              const name = isGroup ? conv.groupName : (otherUser?.name || 'Unknown User');
              
              const status = sendingTo[conv._id];
              const isSending = status === 'sending';
              const isSent = status === 'sent';

              return (
                <div key={conv._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-border/30 hover:bg-surface-border/50 transition-colors border border-transparent hover:border-surface-border group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 border border-white/10 shadow-[0_0_10px_rgba(139,92,246,0.15)] overflow-hidden shrink-0 flex items-center justify-center">
                      {isGroup ? (
                        conv.groupImage 
                          ? <img src={conv.groupImage} alt={name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-sm">{name?.charAt(0)}</span>
                      ) : (
                        otherUser?.profilePicture 
                          ? <img src={otherUser.profilePicture} alt={name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-sm">{name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-white truncate">{name}</p>
                      <p className="text-xs text-slate-400 truncate">{isGroup ? `${conv.participants?.length} members` : `@${otherUser?.username}`}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleForward(conv._id)}
                    disabled={isSending || isSent}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSent ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : isSending ? 'bg-surface border border-brand-500 text-brand-400 cursor-not-allowed'
                      : 'bg-brand-500 text-white hover:bg-brand-400'
                    }`}
                  >
                    {isSent ? <HiCheck className="w-5 h-5 mx-auto" /> : isSending ? <Spinner size="sm" /> : 'Send'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
