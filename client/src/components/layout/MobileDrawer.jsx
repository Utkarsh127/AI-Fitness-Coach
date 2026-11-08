import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiX, 
  FiList, 
  FiVideo, 
  FiFilm,
  FiBell, 
  FiUser, 
  FiLogOut,
  FiMessageSquare,
  FiShield
} from 'react-icons/fi';
import { clearUser } from '../../store/slices/authSlice.js';

const MobileDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);

  if (!isOpen) return null;

  const links = [
    { name: 'Exercises', to: '/exercises', icon: FiList },
    { name: 'Messages', to: '/messages', icon: FiMessageSquare },
    { name: 'Fitness Videos', to: '/videos', icon: FiVideo },
    { name: 'Fitness Shorts', to: '/shorts', icon: FiFilm },
    { name: 'Learning Hub', to: '/learning', icon: FiVideo },
  ];

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative flex w-full max-w-xs flex-col bg-surface h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white">AI</div>
            <span className="font-display font-bold text-lg text-white">Menu</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 p-3 rounded-xl font-medium transition-colors
                ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-300 hover:bg-surface-border/50 hover:text-white'}
              `}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 p-3 rounded-xl font-medium transition-colors mt-2 border border-brand-500/20
                ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-300 hover:bg-brand-500/10 hover:text-brand-400'}
              `}
            >
              <FiShield className="w-5 h-5" />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </div>

        <div className="p-4 border-t border-surface-border space-y-2">
          <NavLink
            to="/notifications"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center justify-between p-3 rounded-xl font-medium transition-colors
              ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-300 hover:bg-surface-border/50 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-4">
              <FiBell className="w-5 h-5" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-4 p-3 rounded-xl font-medium transition-colors
              ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-300 hover:bg-surface-border/50 hover:text-white'}
            `}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-600 shrink-0 bg-slate-700">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate">{user?.name || 'Profile'}</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl font-medium text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
