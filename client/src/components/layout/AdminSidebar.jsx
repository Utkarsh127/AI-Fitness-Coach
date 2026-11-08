import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiHome, 
  FiUsers, 
  FiShield, 
  FiMessageSquare, 
  FiFileText, 
  FiActivity,
  FiSettings,
  FiLogOut,
  FiArrowLeft
} from 'react-icons/fi';
import { clearUser } from '../../store/slices/authSlice.js';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const adminLinks = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: FiHome },
    { name: 'Users', to: '/admin/users', icon: FiUsers },
    { name: 'Reports', to: '/admin/reports', icon: FiFileText },
    { name: 'Community Mod', to: '/admin/community', icon: FiShield },
    { name: 'Messages Mod', to: '/admin/messages', icon: FiMessageSquare },
    { name: 'Audit Logs', to: '/admin/logs', icon: FiActivity },
  ];

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-surface-border shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-surface-border">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center font-bold text-white">
            <FiShield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-white">Admin Center</span>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
              ${isActive ? 'bg-red-500/10 text-red-400' : 'text-slate-400 hover:text-white hover:bg-surface-border/50'}
            `}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-surface-border space-y-1">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 transition-colors border border-brand-500/20"
        >
          <FiArrowLeft className="w-5 h-5 shrink-0" />
          <span>Exit Admin Panel</span>
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-400">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-red-500 shrink-0 bg-slate-700">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="truncate text-red-400">{user?.name || 'Admin'} (Admin)</span>
        </div>

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

export default AdminSidebar;
