/**
 * @component NotificationDropdown
 * @description A dropdown for quick notification access in the navigation bar.
 */

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi';
import { fetchNotifications, markAllAsRead, clearAllNotifications } from '../../store/slices/notificationSlice.js';
import NotificationCard from './NotificationCard.jsx';
import { Spinner } from '../common/Loader.jsx';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  
  const { items, unreadCount, isLoading } = useSelector(state => state.notifications);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={toggleDropdown}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-border transition-colors relative"
      >
        <HiOutlineBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-surface text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-surface-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
          
          <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-border/20">
            <h3 className="font-bold text-white">Notifications</h3>
            {items.length > 0 && (
              <div className="flex gap-3 text-xs font-medium">
                <button onClick={() => dispatch(markAllAsRead())} className="text-brand-400 hover:text-brand-300">Mark all read</button>
                <button onClick={() => {
                  if(window.confirm('Clear all?')) dispatch(clearAllNotifications());
                }} className="text-slate-400 hover:text-red-400">Clear</button>
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1 bg-surface/50 max-h-[400px]">
            {isLoading && items.length === 0 ? (
              <div className="p-8 flex justify-center"><Spinner size="md" /></div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <HiOutlineBell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {items.slice(0, 10).map(notification => (
                  <NotificationCard 
                    key={notification._id} 
                    notification={notification} 
                    onCloseDropdown={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-surface-border bg-surface-border/20 text-center">
            <Link 
              to="/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-brand-400 hover:text-brand-300"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
