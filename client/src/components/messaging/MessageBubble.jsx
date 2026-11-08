/**
 * @component MessageBubble
 * @description Single chat message bubble supporting text, media, and receipts.
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { HiCheck, HiX, HiDotsVertical, HiTrash, HiShare } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth.js';
import { deleteMessageForMe, deleteMessageForEveryone } from '../../store/slices/messagingSlice.js';

const MessageBubble = ({ message, isOwn, onForward }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }
      if (event.target.closest('.message-options-portal')) {
        return;
      }
      setShowMenu(false);
    };

    const handleScroll = (event) => {
      if (event.target.closest && event.target.closest('.message-options-portal')) return;
      setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // capture phase
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showMenu]);

  const handleToggleMenu = () => {
    if (showMenu) {
      setShowMenu(false);
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = 150; // Approx height of menu
        const spaceBelow = window.innerHeight - rect.bottom;
        
        let top;
        let left;

        // Vertical positioning
        if (spaceBelow > menuHeight + 10) {
          top = rect.bottom + 8; // open below
        } else {
          top = rect.top - menuHeight - 8; // open above
        }
        
        // Horizontal positioning
        if (isOwn) {
          left = rect.right - 192; // 192px = w-48
          if (left < 10) left = 10;
        } else {
          left = rect.left;
          if (left + 192 > window.innerWidth - 10) left = window.innerWidth - 192 - 10;
        }

        setMenuPosition({ top, left });
      }
      setShowMenu(true);
    }
  };

  const handleDeleteForMe = () => {
    dispatch(deleteMessageForMe(message._id));
    setShowMenu(false);
  };

  const handleDeleteForEveryone = () => {
    dispatch(deleteMessageForEveryone(message._id));
    setShowMenu(false);
  };
  
  // Calculate if read by everyone else in the conversation
  const isRead = message.readBy?.some(r => r.user !== user._id);

  return (
    <div className={`flex flex-col mb-4 max-w-[85%] ${isOwn ? 'self-end items-end' : 'self-start items-start'}`}>
      
      {!isOwn && (
        <span className="text-xs text-slate-400 font-medium ml-2 mb-1.5">{message.sender?.name}</span>
      )}
      
      <div className={`flex items-center gap-2 group relative ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`p-3.5 rounded-2xl border ${isOwn ? 'bg-slate-800 text-white shadow-sm shadow-black/20 border-[#B4BECD]/30' : 'glass-card border-surface-border text-slate-200'}`}>
          
          {message.isDeleted ? (
            <div className="flex items-center gap-2">
              <p className="italic opacity-80 text-[15px]">This message was deleted</p>
            </div>
          ) : (
            <>
              {/* Forwarded Indicator */}
              {message.isForwarded && (
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  <HiShare className="w-3.5 h-3.5" /> Forwarded
                </div>
              )}

              {/* Reply Preview */}
              {message.replyTo && (
                <div className={`p-2 mb-2 rounded-lg text-sm border-l-2 ${isOwn ? 'bg-slate-900/50 border-slate-500' : 'bg-surface/50 border-brand-500'}`}>
                  <span className="font-bold block mb-1">{message.replyTo.sender?.name}</span>
                  <span className="opacity-80 truncate block">{message.replyTo.content || 'Attachment'}</span>
                </div>
              )}

              {/* Media Attachments */}
              {message.attachments?.length > 0 && (
                <div className={`mb-2 grid gap-1 rounded-lg overflow-hidden ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {message.attachments.map((url, idx) => (
                    <div key={idx} className="relative aspect-square sm:aspect-auto sm:max-h-48 cursor-pointer overflow-hidden group bg-black/10" onClick={() => setSelectedImage(url)}>
                      <img
                        src={url}
                        alt="Attachment"
                        className="w-full h-full sm:h-48 object-cover group-hover:scale-105 transition-transform"
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          if (!e.currentTarget.parentElement.querySelector('.img-error-msg')) {
                            const msg = document.createElement('span');
                            msg.className = 'img-error-msg text-white/50 text-xs text-center p-2';
                            msg.textContent = 'Image unavailable';
                            e.currentTarget.parentElement.appendChild(msg);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Text Content */}
              {message.content && (
                <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                  {message.content}
                </p>
              )}
            </>
          )}
          
          {/* Meta / Time / Receipts */}
          <div className={`flex items-center gap-1.5 mt-2 text-[11px] font-medium text-slate-400 ${isOwn ? 'justify-end' : ''}`}>
            <span>{format(new Date(message.createdAt), 'h:mm a')}</span>
            {isOwn && (
              <span className="flex -space-x-1">
                <HiCheck className={`w-3.5 h-3.5 ${isRead ? 'text-brand-400 drop-shadow-md' : 'text-slate-500'}`} />
                <HiCheck className={`w-3.5 h-3.5 ${isRead ? 'text-brand-400 drop-shadow-md' : 'text-slate-500'}`} />
              </span>
            )}
          </div>
        </div>

        {/* Action Menu */}
        {!message.isDeleted && (
          <div>
            <button 
              ref={buttonRef}
              onClick={handleToggleMenu}
              className={`p-1.5 text-slate-400 hover:text-white transition-opacity rounded-full hover:bg-surface-border ${showMenu ? 'opacity-100 bg-surface-border' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}
            >
              <HiDotsVertical className="w-5 h-5" />
            </button>
            {showMenu && menuPosition && createPortal(
              <div 
                className="message-options-portal fixed z-[9999] w-48 bg-surface border border-surface-border rounded-xl shadow-2xl py-1"
                style={{ top: menuPosition.top, left: menuPosition.left }}
              >
                <button 
                  onClick={() => { setShowMenu(false); if(onForward) onForward(message); }} 
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-surface-border flex items-center gap-2"
                >
                  <HiShare className="w-4 h-4 text-brand-400" /> Forward
                </button>
                <div className="h-px bg-surface-border my-1 mx-2" />
                <button onClick={handleDeleteForMe} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-surface-border flex items-center gap-2">
                  <HiTrash className="w-4 h-4" /> Delete for me
                </button>
                {isOwn && (
                  <button onClick={handleDeleteForEveryone} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surface-border flex items-center gap-2">
                    <HiTrash className="w-4 h-4" /> Delete for everyone
                  </button>
                )}
              </div>,
              document.body
            )}
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <HiX className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Expanded Attachment" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
