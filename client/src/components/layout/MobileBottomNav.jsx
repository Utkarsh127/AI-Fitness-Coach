import { NavLink } from 'react-router-dom';
import { FiHome, FiActivity, FiTarget, FiUsers, FiMenu } from 'react-icons/fi';

const MobileBottomNav = ({ onOpenMenu }) => {
  const links = [
    { name: 'Home', to: '/dashboard', icon: FiHome },
    { name: 'AI Coach', to: '/ai-coach', icon: FiActivity },
    { name: 'Workouts', to: '/workouts/plans', icon: FiTarget },
    { name: 'Community', to: '/community', icon: FiUsers },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-t border-surface-border z-40 flex items-center justify-around px-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors
            ${isActive ? 'text-brand-500' : 'text-slate-400 hover:text-slate-200'}
          `}
        >
          <link.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{link.name}</span>
        </NavLink>
      ))}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <FiMenu className="w-5 h-5" />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;
