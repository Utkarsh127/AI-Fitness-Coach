/**
 * @page PostDetailsPage
 * @description View a single post and its comment thread.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowLeft } from 'react-icons/hi';
import { fetchPostDetails, fetchPostComments, clearCurrentPost } from '../../store/slices/communitySlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import PostCard from '../../components/community/PostCard.jsx';
import CommentThread from '../../components/community/CommentThread.jsx';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPost: post, currentComments: comments, isLoading, error } = useSelector(state => state.community);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (id) {
      setIsInitialLoad(true);
      dispatch(fetchPostDetails(id))
        .unwrap()
        .then(() => {
          if (mounted) dispatch(fetchPostComments(id));
        })
        .catch(() => {
          // Do not fetch comments if post details failed (e.g., 404)
        })
        .finally(() => {
          if (mounted) setIsInitialLoad(false);
        });
    }
    return () => { 
      mounted = false;
      dispatch(clearCurrentPost()); 
    };
  }, [dispatch, id]);

  if (isLoading || isInitialLoad) return <FullScreenLoader />;

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-32 pb-12 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-surface-border mb-4">
          <HiArrowLeft className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Post not found</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">This post may have been deleted, or you might not have permission to view it.</p>
        <button onClick={() => navigate('/community')} className="btn-primary px-8 h-12">
          Return to Community
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center gap-4 sticky top-0 bg-surface/90 backdrop-blur-md py-4 z-10 border-b border-surface-border">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <HiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Post</h1>
      </div>

      <PostCard post={post} />

      <div className="glass-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-white mb-6">Comments ({post.commentsCount})</h2>
        <CommentThread comments={comments} postId={post._id} />
      </div>

    </div>
  );
};

export default PostDetailsPage;
