import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/admin.api.js';
import { Spinner } from '../../components/common/Loader.jsx';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReports({ status: filterStatus, limit: 100 });
      setReports(res.data.data.docs);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await adminApi.updateReportStatus(reportId, newStatus);
      toast.success(`Report marked as ${newStatus}`);
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update report');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Reviewing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Dismissed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports Workflow</h1>
          <p className="text-slate-400 mt-1">Review user reports and take moderation actions.</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-surface-border/20 border border-surface-border rounded-xl text-white px-4 py-2.5 outline-none focus:border-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-border/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Reporter</th>
                <th className="p-4 font-medium">Target</th>
                <th className="p-4 font-medium">Reason</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center"><Spinner /></td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No reports found.</td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report._id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{report.reporter?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">@{report.reporter?.username || 'unknown'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{report.targetType}</div>
                      <div className="text-xs text-brand-400 font-mono truncate max-w-[120px]">{report.targetId}</div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-sm">
                      <p className="line-clamp-2">{report.reason}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      {report.status !== 'Resolved' && report.status !== 'Dismissed' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                            className="px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 rounded-lg transition-colors text-xs font-medium"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(report._id, 'Dismissed')}
                            className="px-3 py-1.5 bg-slate-500/10 text-slate-400 hover:bg-slate-500 hover:text-white border border-slate-500/20 rounded-lg transition-colors text-xs font-medium"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
