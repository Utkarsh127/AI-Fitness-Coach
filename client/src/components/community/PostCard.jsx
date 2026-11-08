/**
 * @component PostCard
 * @description Renders a single post in the feed.
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  HiHeart, HiOutlineHeart, 
  HiChatAlt, 
  HiBookmark, HiOutlineBookmark,
  HiLocationMarker, HiDotsHorizontal, HiTrash, HiX,
  HiShare, HiLink, HiFlag
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { optimisticLike, optimisticBookmark, toggleLike, toggleBookmark, deletePost } from '../../store/slices/communitySlice.js';
import * as adminApi from '../../api/admin.api.js';

const PostCard = ({ post, onCommentClick }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll lock when modal is open
  useEffect(() => {
    if (isReporting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReporting]);

  const isLiked = post.likes?.includes(user._id);
  const isBookmarked = post.bookmarks?.includes(user._id);
  const isAuthor = post.author?._id === user._id;

  const handleLike = () => {
    // Optimistic UI update
    dispatch(optimisticLike({ postId: post._id, userId: user._id }));
    // Background sync
    dispatch(toggleLike({ postId: post._id, userId: user._id }));
  };

  const handleBookmark = () => {
    dispatch(optimisticBookmark({ postId: post._id, userId: user._id }));
    dispatch(toggleBookmark({ postId: post._id, userId: user._id }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post._id));
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/community/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
    setShowOptions(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/community/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ai Fitness Coach',
          text: post.caption ? (post.caption.substring(0, 50) + (post.caption.length > 50 ? '...' : '')) : 'Check out this post!',
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    try {
      await adminApi.submitReport({
        targetType: 'Post',
        targetId: post._id,
        reportedUserId: post.author._id,
        reason: reportReason
      });
      toast.success('Report submitted successfully. Thank you.');
      setIsReporting(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    }
  };

  // Convert hashtags to colored text
  const formatCaption = (text) => {
    if (!text) return null;
    return text.split(/(#[a-zA-Z0-9_]+)/g).map((part, i) => {
      if (part.startsWith('#')) return <span key={i} className="text-brand-400">{part}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <Link to={`/community/user/${post.author?._id}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-surface-border overflow-hidden border border-surface-border">
            {post.author?.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-brand-500/10">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
              {post.author?.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>@{post.author?.username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
        
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowOptions(!showOptions)} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-surface-border transition-colors">
            <HiDotsHorizontal className="w-5 h-5" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-surface-border rounded-xl shadow-xl z-[50] overflow-hidden">
              {isAuthor ? (
                <button onClick={() => { setShowOptions(false); handleDelete(); }} className="w-full px-4 py-3 text-left text-red-400 hover:bg-surface-border flex items-center gap-2 text-sm font-medium transition-colors">
                  <HiTrash className="w-4 h-4" /> Delete Post
                </button>
              ) : (
                <button onClick={() => { setShowOptions(false); setIsReporting(true); }} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-surface-border flex items-center gap-2 text-sm font-medium transition-colors">
                  <HiFlag className="w-4 h-4 text-slate-400" /> Report Post
                </button>
              )}
              <div className="h-px bg-surface-border my-0" />
              <button onClick={handleCopyLink} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-surface-border flex items-center gap-2 text-sm font-medium transition-colors">
                <HiLink className="w-4 h-4 text-slate-400" /> Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Category/Location */}
      {(post.postType !== 'General Fitness' || post.location) && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {post.postType !== 'General Fitness' && (
            <span className="badge badge-blue">{post.postType}</span>
          )}
          {post.location && (
            <span className="badge bg-surface-border text-slate-300 flex items-center gap-1">
              <HiLocationMarker /> {post.location}
            </span>
          )}
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-4">
          <p className="text-slate-300 whitespace-pre-wrap text-sm sm:text-base">
            {formatCaption(post.caption)}
          </p>
        </div>
      )}

      {/* Media Carousel */}
      {post.images?.length > 0 && (
        <div className={`grid gap-1 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.map((img, idx) => (
            <div 
              key={idx} 
              className={`bg-surface-border relative cursor-pointer overflow-hidden group ${post.images.length === 3 && idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt="Post media"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  if (!e.currentTarget.parentElement.querySelector('.img-error-msg')) {
                    const msg = document.createElement('span');
                    msg.className = 'img-error-msg text-slate-500 text-xs text-center p-2';
                    msg.textContent = 'Image unavailable';
                    e.currentTarget.parentElement.appendChild(msg);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link to={`/community?tag=${tag}`} key={tag} className="text-xs text-brand-400 hover:text-brand-300">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Achievement/Workout Ref (if any) */}
      {post.workoutReference && (
        <div className="mx-4 my-2 p-3 rounded-lg border border-brand-500/30 bg-brand-500/5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">Workout Completed</p>
            <p className="text-white text-sm font-medium">{post.workoutReference.duration} mins • {post.workoutReference.totalVolume}kg volume</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={handleLike} className="flex items-center gap-2 group transition-colors">
            {isLiked ? (
              <HiHeart className="w-6 h-6 text-red-500 scale-110 transition-transform" />
            ) : (
              <HiOutlineHeart className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            )}
            <span className={`text-sm font-medium ${isLiked ? 'text-white' : 'text-slate-400'}`}>{post.likes?.length || 0}</span>
          </button>
          
          <button 
            onClick={onCommentClick} 
            className="flex items-center gap-2 group transition-colors"
          >
            <HiChatAlt className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-slate-400 group-hover:text-white">{post.commentsCount || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleShare} className="group transition-colors" title="Share">
            <HiShare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          
          <button onClick={handleBookmark} className="group transition-colors" title="Save">
            {isBookmarked ? (
              <HiBookmark className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
            ) : (
              <HiOutlineBookmark className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>
      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <HiX className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Expanded Post Media" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Report Modal */}
      {isReporting && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => { setIsReporting(false); setReportReason(''); }}
        >
          <div 
            className="bg-surface border border-surface-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">Report Post</h3>
            <p className="text-slate-400 text-sm mb-4">Please let us know why you are reporting this post.</p>
            <textarea
              className="w-full bg-surface-border/20 border border-surface-border rounded-xl text-white p-3 min-h-[100px] outline-none focus:border-brand-500 mb-4"
              placeholder="e.g. Inappropriate content, spam, harassment..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setIsReporting(false); setReportReason(''); }}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitReport}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl font-medium transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PostCard;
