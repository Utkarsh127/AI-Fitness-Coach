/**
 * @component CommentThread
 * @description Renders the comment tree for a post.
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineChatAlt, HiOutlineReply, HiX, HiDotsHorizontal, HiTrash, HiReply, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth.js';
import { addComment, deleteComment } from '../../store/slices/communitySlice.js';
import { Spinner } from '../common/Loader.jsx';

const CommentItem = ({ comment, postId, onReplyClick }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(user._id));
  const isAuthor = comment.author?._id === user._id;

  const handleLike = () => {
    // Basic local state toggle since comment likes aren't heavily tracked in Redux state for this MVP
    setIsLiked(!isLiked);
    // Future: dispatch action to actually sync like to backend
  };

  const handleDelete = () => {
    if (window.confirm('Delete this comment?')) {
      dispatch(deleteComment(comment._id));
    }
  };

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-surface-border overflow-hidden shrink-0">
        {comment.author?.profilePicture ? (
          <img src={comment.author.profilePicture} alt="User" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-brand-500/10">
            {comment.author?.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-surface border border-surface-border p-3 rounded-2xl rounded-tl-none">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-sm text-white">{comment.author?.name}</span>
            <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-slate-300 text-sm whitespace-pre-wrap">{comment.message}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 px-2">
          <button onClick={handleLike} className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1">
            {isLiked ? <HiHeart className="text-red-500" /> : <HiOutlineHeart />}
            {isLiked ? 'Liked' : 'Like'}
          </button>
          {!comment.parentComment && (
            <button onClick={() => onReplyClick(comment)} className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1">
              <HiReply /> Reply
            </button>
          )}
          {isAuthor && (
            <button onClick={handleDelete} className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1">
              <HiTrash /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentThread = ({ comments, postId }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // comment object
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    const data = {
      message,
      ...(replyingTo && { parentComment: replyingTo._id })
    };

    await dispatch(addComment({ postId, data }));
    setMessage('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {replyingTo && (
          <div className="flex items-center justify-between text-xs bg-surface-border px-3 py-1.5 rounded-lg text-slate-300 w-max">
            <span>Replying to <span className="font-bold">{replyingTo.author?.name}</span></span>
            <button type="button" onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white ml-2">Cancel</button>
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="input bg-surface-border flex-1"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button type="submit" disabled={isSubmitting || !message.trim()} className="btn-primary px-6 h-12">
            {isSubmitting ? <Spinner size="sm" /> : 'Post'}
          </button>
        </div>
      </form>

      {/* Thread */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment._id} className="space-y-3">
            {/* Top level comment */}
            <CommentItem comment={comment} postId={postId} onReplyClick={setReplyingTo} />
            
            {/* Replies (1 level deep) */}
            {comment.replies?.length > 0 && (
              <div className="pl-11 space-y-3 relative before:absolute before:left-[1.35rem] before:top-[-10px] before:bottom-6 before:w-px before:bg-surface-border">
                {comment.replies.map(reply => (
                  <div key={reply._id} className="relative before:absolute before:left-[-1.4rem] before:top-4 before:w-4 before:h-px before:bg-surface-border">
                    <CommentItem comment={reply} postId={postId} onReplyClick={setReplyingTo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CommentThread;
