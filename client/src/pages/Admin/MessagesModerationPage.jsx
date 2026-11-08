import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import * as adminApi from '../../api/admin.api.js';
import { Spinner } from '../../components/common/Loader.jsx';

const MessagesModerationPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMessages({ limit: 100 });
      setMessages(res.data.data.docs);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (msgId) => {
    if (!window.confirm('Are you sure you want to permanently delete this message globally?')) return;
    try {
      await adminApi.deleteMessage(msgId);
      toast.success('Message deleted successfully');
      setMessages(messages.filter(m => m._id !== msgId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Global Message Moderation</h1>
        <p className="text-slate-400 mt-1">Review and delete inappropriate messages globally.</p>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-border/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Sender</th>
                <th className="p-4 font-medium">Content</th>
                <th className="p-4 font-medium">Media</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center"><Spinner /></td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No messages found.</td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg._id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{msg.sender?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">@{msg.sender?.username || 'unknown'}</div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-md">
                      {msg.content ? (
                        <p className="truncate" title={msg.content}>{msg.content}</p>
                      ) : (
                        <span className="text-slate-500 italic">No text content</span>
                      )}
                    </td>
                    <td className="p-4">
                      {msg.attachmentUrl ? (
                        <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                          View Image
                        </a>
                      ) : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="inline-flex p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-lg transition-colors"
                        title="Delete Message"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
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

export default MessagesModerationPage;
