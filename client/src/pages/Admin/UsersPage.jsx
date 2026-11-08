import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/admin.api.js';
import UserTable from './components/UserTable.jsx';
import { CreateUserModal, EditUserModal } from './components/UserModals.jsx';
import { HiOutlineSearch } from 'react-icons/hi';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ search, limit: 100 });
      setUsers(res.data.data.docs);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleDeactivate = async (userId, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      if (isActive) {
         await adminApi.deactivateUser(userId);
         toast.success('User deactivated successfully');
      } else {
         await adminApi.updateUser(userId, { isActive: true });
         toast.success('User activated successfully');
      }
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-slate-400 mt-1">Search, filter, edit, and suspend users.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-400 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20"
        >
          + Add New User
        </button>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-4 border-b border-surface-border flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-surface-border/20 border border-surface-border rounded-xl text-white pl-10 pr-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <UserTable 
            users={users} 
            loading={loading} 
            onEdit={setEditingUser} 
            onDeactivate={handleDeactivate} 
          />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => { setIsCreateModalOpen(false); fetchUsers(); }} 
        />
      )}

      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSuccess={() => { setEditingUser(null); fetchUsers(); }} 
        />
      )}
    </div>
  );
};

export default UsersPage;
