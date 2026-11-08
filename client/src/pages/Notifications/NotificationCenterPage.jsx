/**
 * @page NotificationCenterPage
 * @description Page displaying all user notifications.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiCheck, HiTrash, HiOutlineBell } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from '../../store/slices/notificationSlice.js';
import { Spinner } from '../../components/common/Loader.jsx';

const NotificationCenterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading, pagination } = useSelector(state => state.notifications);
  
  const observer = useRef();
  
  useEffect(() => {
    dispatch(fetchNotifications({ limit: 20, page: 1 }));
  }, [dispatch]);

  const lastNotificationRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.totalPages) {
        dispatch(fetchNotifications({ limit: 20, page: pagination.page + 1 }));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, pagination.page, pagination.totalPages, dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'Like': return 'bg-pink-500/10 text-pink-500';
      case 'Comment': 
      case 'Reply': return 'bg-blue-500/10 text-blue-500';
      case 'New Chat Message': return 'bg-brand-500/10 text-brand-500';
      case 'Achievement': 
      case 'PR Achieved': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-surface-border text-slate-400';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HiOutlineBell className="w-6 h-6 text-brand-400" />
          Notifications
        </h1>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={() => dispatch(markAllAsRead())}
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Mark all as read
            </button>
            <span className="text-surface-border">|</span>
            <button 
              onClick={() => dispatch(clearAllNotifications())}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden divide-y divide-surface-border">
        {items.length === 0 && !isLoading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-border mx-auto flex items-center justify-center mb-4">
              <HiOutlineBell className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You're all caught up!</h3>
            <p className="text-slate-400">No new notifications at the moment.</p>
          </div>
        ) : (
          items.map((notification, idx) => {
            const isLast = idx === items.length - 1;
            
            return (
              <div 
                key={notification._id} 
                ref={isLast ? lastNotificationRef : null}
                className={`p-4 flex items-start gap-4 transition-colors hover:bg-surface-border/30 ${
                  !notification.isRead ? 'bg-brand-500/5' : ''
                }`}
              >
                {/* Icon/Avatar */}
                <div 
                  className="shrink-0 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-border bg-surface-border flex items-center justify-center">
                      {notification.image ? (
                        <img src={notification.image} alt="User avatar" className="w-full h-full object-cover" />
                      ) : notification.sender?.profilePicture ? (
                        <img src={notification.sender.profilePicture} alt="User avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${getIconColor(notification.type)}`}>
                          {notification.sender?.name?.charAt(0).toUpperCase() || <HiOutlineBell className="w-6 h-6" />}
                        </div>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-500 border-2 border-surface rounded-full" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="text-[15px] text-slate-300">
                    {notification.sender && (
                      <span className="font-bold text-white mr-1">{notification.sender.name}</span>
                    )}
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!notification.isRead && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); dispatch(markAsRead(notification._id)); }}
                      className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-full transition-colors"
                      title="Mark as read"
                    >
                      <HiCheck className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); dispatch(deleteNotification(notification._id)); }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Remove notification"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="p-8 flex justify-center">
            <Spinner size="md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;
