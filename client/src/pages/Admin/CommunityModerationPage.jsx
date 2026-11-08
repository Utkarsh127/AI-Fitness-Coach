import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineTrash, HiOutlineExternalLink, HiOutlineX } from 'react-icons/hi';
import * as adminApi from '../../api/admin.api.js';
import { Spinner } from '../../components/common/Loader.jsx';

const CommunityModerationPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCommunityPosts({ search, limit: 100 });
      setPosts(res.data.data.docs);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      await adminApi.deleteCommunityPost(postId);
      toast.success('Post deleted successfully');
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Community Moderation</h1>
        <p className="text-slate-400 mt-1">Review and manage user posts.</p>
      </div>

      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-4 border-b border-surface-border">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts by caption..."
              className="w-full bg-surface-border/20 border border-surface-border rounded-xl text-white pl-10 pr-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-border/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Author</th>
                <th className="p-4 font-medium">Caption</th>
                <th className="p-4 font-medium">Media</th>
                <th className="p-4 font-medium">Stats</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center"><Spinner /></td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No posts found.</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post._id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                          {post.author?.profilePicture ? (
                            <img src={post.author.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                              {post.author?.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{post.author?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">@{post.author?.username || 'unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">
                      {post.caption || <span className="text-slate-500 italic">No caption</span>}
                    </td>
                    <td className="p-4">
                      {post.images?.length > 0 ? (
                        <span className="px-2 py-1 bg-brand-500/10 text-brand-400 rounded text-xs font-medium border border-brand-500/20">
                          {post.images.length} Image(s)
                        </span>
                      ) : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-400">
                        Likes: {post.likes?.length || 0}<br/>
                        Comments: {post.comments?.length || 0}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex p-2 text-slate-400 hover:text-white bg-surface border border-surface-border rounded-lg transition-colors"
                        title="View Post Details"
                      >
                        <HiOutlineExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="inline-flex p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-lg transition-colors"
                        title="Delete Post"
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

      {/* View Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-surface border border-surface-border p-6 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-surface-border/20 rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6">Post Details</h3>
            
            <div className="overflow-y-auto pr-2 space-y-6">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden shrink-0">
                  {selectedPost.author?.profilePicture ? (
                    <img src={selectedPost.author.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white">
                      {selectedPost.author?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{selectedPost.author?.name || 'Unknown'}</div>
                  <div className="text-slate-400">@{selectedPost.author?.username || 'unknown'}</div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Caption</h4>
                <div className="bg-surface-border/10 p-4 rounded-xl text-slate-200 whitespace-pre-wrap">
                  {selectedPost.caption || <span className="italic text-slate-500">No caption provided.</span>}
                </div>
              </div>

              {/* Media */}
              {selectedPost.images?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Attached Media</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPost.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-surface-border bg-black/50">
                        <img src={img} alt={`Post media ${i + 1}`} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata & Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-border/10 p-3 rounded-xl border border-surface-border/50">
                  <div className="text-xs text-slate-500 mb-1">Created</div>
                  <div className="font-medium text-white text-sm">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-surface-border/10 p-3 rounded-xl border border-surface-border/50">
                  <div className="text-xs text-slate-500 mb-1">Post ID</div>
                  <div className="font-medium text-white text-xs font-mono truncate">
                    {selectedPost._id}
                  </div>
                </div>
                <div className="bg-surface-border/10 p-3 rounded-xl border border-surface-border/50">
                  <div className="text-xs text-slate-500 mb-1">Likes</div>
                  <div className="font-bold text-white">
                    {selectedPost.likes?.length || 0}
                  </div>
                </div>
                <div className="bg-surface-border/10 p-3 rounded-xl border border-surface-border/50">
                  <div className="text-xs text-slate-500 mb-1">Comments</div>
                  <div className="font-bold text-white">
                    {selectedPost.comments?.length || selectedPost.commentsCount || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-surface-border flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-surface-border/50 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedPost(null);
                  handleDelete(selectedPost._id);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <HiOutlineTrash className="w-4 h-4" /> Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityModerationPage;
