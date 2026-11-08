/**
 * @component NotificationCard
 * @description Renders a single notification item.
 */

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  HiOutlineHeart, HiOutlineChatAlt, HiOutlineReply, 
  HiOutlineSpeakerphone, HiOutlineStar, HiOutlineChat,
  HiTrash, HiCheck
} from 'react-icons/hi';
import { markAsRead, deleteNotification } from '../../store/slices/notificationSlice.js';

const getIcon = (type) => {
  switch (type) {
    case 'Like': return <HiOutlineHeart className="text-red-500" />;
    case 'Comment': return <HiOutlineChatAlt className="text-brand-500" />;
    case 'Reply': return <HiOutlineReply className="text-brand-400" />;
    case 'New Chat Message': return <HiOutlineChat className="text-accent-500" />;
    case 'Achievement': 
    case 'PR Achieved':
    case 'Workout Completed': return <HiOutlineStar className="text-yellow-500" />;
    default: return <HiOutlineSpeakerphone className="text-slate-400" />;
  }
};

const NotificationCard = ({ notification, onCloseDropdown }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (e) => {
    // If not clicking an action button, navigate to actionUrl
    if (!e.target.closest('button')) {
      if (!notification.isRead) dispatch(markAsRead(notification._id));
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
        if (onCloseDropdown) onCloseDropdown();
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 flex gap-4 transition-colors cursor-pointer border-b border-surface-border last:border-0 relative group ${notification.isRead ? 'bg-transparent' : 'bg-brand-500/5'}`}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full"></div>
      )}

      {/* Avatar / Image */}
      <div className="relative shrink-0 w-12 h-12">
        <div className="w-12 h-12 rounded-full bg-surface-border overflow-hidden">
          {notification.image || notification.sender?.profilePicture ? (
            <img src={notification.image || notification.sender.profilePicture} alt="Sender" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-slate-700 text-slate-300">
              {notification.sender?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface flex items-center justify-center shadow-lg border border-surface-border">
          {getIcon(notification.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300">
          {notification.sender && <span className="font-bold text-white mr-1">{notification.sender.name}</span>}
          {notification.message}
        </p>
        <span className="text-xs text-slate-500 mt-1 block">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Actions (Hover) */}
      <div className="shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch(markAsRead(notification._id)); }}
            className="p-1.5 text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
            title="Mark as read"
          >
            <HiCheck className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); dispatch(deleteNotification(notification._id)); }}
          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default NotificationCard;
