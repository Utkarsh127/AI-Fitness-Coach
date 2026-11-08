import { format } from 'date-fns';
import { Spinner } from '../../../components/common/Loader.jsx';

const UserTable = ({ users, loading, onEdit, onDeactivate }) => {
  if (loading) {
    return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>;
  }

  if (users.length === 0) {
    return <div className="p-8 text-center text-slate-400">No users found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-border/30 text-slate-400 text-sm uppercase tracking-wider">
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Joined</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {users.map(user => (
            <tr key={user._id} className="hover:bg-surface-border/20 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-border overflow-hidden shrink-0">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-400 font-bold bg-brand-500/10">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max ${
                  user.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-4 text-slate-300 text-sm">
                {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => onEdit(user)}
                  className="text-brand-400 hover:text-brand-300 font-medium text-sm mr-3 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeactivate(user._id, user.isActive)}
                  className={`${user.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} font-medium text-sm transition-colors`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
