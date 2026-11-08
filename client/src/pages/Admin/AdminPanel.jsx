import { useState, useEffect } from 'react';
import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineStatusOnline } from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/admin.api.js';
import UserTable from './components/UserTable.jsx';
import { CreateUserModal, EditUserModal } from './components/UserModals.jsx';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });
  const [search, setSearch] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ search, limit: 100 });
      const docs = res.data.data.docs;
      setUsers(docs);
      
      // Calculate Stats
      setStats({
        total: docs.length,
        active: docs.filter(u => u.isActive).length,
        admins: docs.filter(u => u.role === 'admin').length
      });
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]); // re-fetch on search change

  const handleDeactivate = async (userId, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      // Actually we implemented DELETE /admin/users/:id as deactivate/soft-delete
      if (isActive) {
         await adminApi.deactivateUser(userId);
         toast.success('User deactivated successfully');
      } else {
         // Activate using patch
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and platform settings.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          + Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.total} icon={HiOutlineUserGroup} color="text-blue-500" />
        <StatCard title="Active Users" value={stats.active} icon={HiOutlineStatusOnline} color="text-green-500" />
        <StatCard title="Total Admins" value={stats.admins} icon={HiOutlineShieldCheck} color="text-purple-500" />
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-surface-border">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            className="w-full md:w-96 bg-surface-border/50 border-none rounded-xl text-white px-4 py-2 focus:ring-1 focus:ring-brand-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="p-0">
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

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-surface border border-surface-border rounded-2xl p-6 flex items-center justify-between">
    <div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`p-4 rounded-xl bg-surface-border/50 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

export default AdminPanel;
