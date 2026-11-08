import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';
import * as adminApi from '../../../api/admin.api.js';
import { Spinner } from '../../../components/common/Loader.jsx';

export const CreateUserModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', role: 'user'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminApi.createUser(formData);
      toast.success('User created successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="text-xl font-bold text-white">Create New User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><HiX className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input required type="text" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input required type="text" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input required type="email" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input required type="password" minLength={8} className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl flex items-center justify-center min-w-[100px]">
              {loading ? <Spinner size="sm" /> : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name, username: user.username, email: user.email, role: user.role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminApi.updateUser(user._id, formData);
      toast.success('User updated successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><HiX className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input required type="text" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input required type="text" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input required type="email" className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select className="w-full bg-surface-border/50 border-none rounded-xl text-white px-4 py-2"
              value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl flex items-center justify-center min-w-[100px]">
              {loading ? <Spinner size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
