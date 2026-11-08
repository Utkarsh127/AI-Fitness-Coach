import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/admin.api.js';
import { Spinner } from '../../components/common/Loader.jsx';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs({ limit: 100 });
      setLogs(res.data.data.docs);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Audit Logs</h1>
        <p className="text-slate-400 mt-1">Review critical system actions and administrative changes.</p>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-border/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Actor</th>
                <th className="p-4 font-medium">Target ID</th>
                <th className="p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center"><Spinner /></td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No logs found.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-surface-border/30 text-white rounded text-xs font-mono border border-surface-border/50">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {log.actor?.profilePicture ? (
                          <img src={log.actor.profilePicture} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                            {log.actor?.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <div className="text-slate-300 font-medium leading-none">{log.actor?.name || 'Unknown'}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">@{log.actor?.username || 'unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-brand-400">
                      {log.target || '-'}
                    </td>
                    <td className="p-4">
                      <pre className="text-[10px] text-slate-400 font-mono bg-black/20 p-2 rounded max-w-xs overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
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

export default AuditLogsPage;
