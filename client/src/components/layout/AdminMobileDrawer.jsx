import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiHome, FiUsers, FiShield, FiMessageSquare, 
  FiFileText, FiActivity, FiSettings, FiLogOut, FiX, FiArrowLeft
} from 'react-icons/fi';
import { clearUser } from '../../store/slices/authSlice.js';

const AdminMobileDrawer = ({ isOpen, onClose }) => {
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
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-surface border-l border-surface-border shadow-2xl pb-6">
              
              <div className="flex items-center justify-between p-4 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center text-white">
                    <FiShield className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-lg text-white">Admin Center</span>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-surface-border/50 focus:outline-none"
                  onClick={onClose}
                >
                  <FiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 py-4 px-3 space-y-1">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors
                      ${isActive ? 'bg-red-500/10 text-red-400' : 'text-slate-400 hover:text-white hover:bg-surface-border/50'}
                    `}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto px-4 space-y-2">
                <div className="divider mb-4" />
                
                <NavLink
                  to="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-brand-400 border border-brand-500/20"
                >
                  <FiArrowLeft className="w-5 h-5 shrink-0" />
                  <span>Exit Admin Panel</span>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-400 hover:text-red-400"
                >
                  <FiLogOut className="w-5 h-5 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>

            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AdminMobileDrawer;
