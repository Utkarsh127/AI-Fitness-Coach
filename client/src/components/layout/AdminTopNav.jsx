import { FiMenu, FiShield } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const AdminTopNav = ({ onOpenMenu }) => {
  return (
    <header className="md:hidden h-16 bg-surface border-b border-surface-border flex items-center justify-between px-4 sticky top-0 z-40">
      <NavLink to="/admin/dashboard" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center text-white">
          <FiShield className="w-4 h-4" />
        </div>
        <span className="font-display font-bold text-lg text-white">Admin</span>
      </NavLink>
      <button 
        onClick={onOpenMenu}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-border/50 text-white hover:bg-surface-border transition-colors"
      >
        <FiMenu className="w-5 h-5" />
      </button>
    </header>
  );
};

export default AdminTopNav;
