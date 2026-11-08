import { useState, useEffect } from 'react';
import { 
  HiOutlineUserGroup, 
  HiOutlineStatusOnline, 
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/admin.api.js';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setStats(res.data.data);
      } catch (err) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading metrics...</div>;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400 mt-1">High-level metrics and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={HiOutlineUserGroup} color="text-blue-500" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={HiOutlineStatusOnline} color="text-green-500" />
        <StatCard title="Pending Reports" value={stats.pendingReports} icon={HiOutlineExclamationCircle} color="text-red-500" />
        <StatCard title="Total Posts" value={stats.totalPosts} icon={HiOutlineDocumentText} color="text-purple-500" />
        <StatCard title="Total Messages" value={stats.totalMessages} icon={HiOutlineChatAlt2} color="text-cyan-500" />
        <StatCard title="System Admins" value={stats.admins} icon={HiOutlineShieldCheck} color="text-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface border border-surface-border rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Today's Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-surface-border/20 rounded-xl">
              <span className="text-slate-300">New Registrations</span>
              <span className="text-xl font-bold text-white">+{stats.newUsersToday}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-surface-border/20 rounded-xl">
              <span className="text-slate-300">New Community Posts</span>
              <span className="text-xl font-bold text-white">+{stats.newPostsToday}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-surface-border/20 rounded-xl">
              <span className="text-slate-300">Resolved Reports</span>
              <span className="text-xl font-bold text-green-400">{stats.resolvedReports}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-surface border border-surface-border rounded-2xl p-6 flex items-center justify-between">
    <div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`p-4 rounded-xl bg-surface-border/20 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

export default DashboardPage;
