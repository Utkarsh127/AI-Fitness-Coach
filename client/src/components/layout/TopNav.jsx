/**
 * @component TopNav
 * @description Global top navigation bar for desktop and tablet.
 */

import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';

const TopNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white">AI</div>
          <span className="font-display font-bold text-xl text-white hidden sm:block">Fitness Coach</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          
          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-surface-border overflow-hidden border border-surface-border">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
        </div>
        
      </div>
    </header>
  );
};

export default TopNav;
