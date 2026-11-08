import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiHome, 
  FiMessageSquare, // Messages
  FiActivity, // AI Coach
  FiTarget, // Workouts
  FiList, // Exercises
  FiUsers, // Community
  FiVideo, // Learning Hub
  FiBell,
  FiUser,
  FiLogOut,
  FiShield,
  FiFilm
} from 'react-icons/fi';
import { clearUser } from '../../store/slices/authSlice.js';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);

  const mainLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: FiHome },
    { name: 'AI Coach', to: '/ai-coach', icon: FiActivity },
    { name: 'Workouts', to: '/workouts/plans', icon: FiTarget },
    { name: 'Exercises', to: '/exercises', icon: FiList },
    { name: 'Community', to: '/community', icon: FiUsers },
    { name: 'Messages', to: '/messages', icon: FiMessageSquare },
    { name: 'Fitness Videos', to: '/videos', icon: FiVideo },
    { name: 'Fitness Shorts', to: '/shorts', icon: FiFilm },
    { name: 'Learning Hub', to: '/learning', icon: FiVideo },
  ];

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-surface-border shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-surface-border">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white">AI</div>
          <span className="font-display font-bold text-xl text-white">Fitness Coach</span>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
              ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-400 hover:text-white hover:bg-surface-border/50'}
            `}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <span>{link.name}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors mt-4 border border-brand-500/20
              ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-400 hover:text-brand-400 hover:bg-brand-500/10'}
            `}
          >
            <FiShield className="w-5 h-5 shrink-0" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-surface-border space-y-1">
        <NavLink
          to="/notifications"
          className={({ isActive }) => `
            flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors
            ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-400 hover:text-white hover:bg-surface-border/50'}
          `}
        >
          <div className="flex items-center gap-3">
            <FiBell className="w-5 h-5 shrink-0" />
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
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
            ${isActive ? 'bg-brand-500/10 text-brand-500' : 'text-slate-400 hover:text-white hover:bg-surface-border/50'}
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
