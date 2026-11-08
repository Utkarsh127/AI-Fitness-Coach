/**
 * @page CommunityFeedPage
 * @description The main social feed.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiSearch, HiFilter } from 'react-icons/hi';
import useDebounce from '../../hooks/useDebounce.js';
import { fetchFeed } from '../../store/slices/communitySlice.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';
import PostCard from '../../components/community/PostCard.jsx';

const POST_TYPES = ['All', 'Workout', 'Progress Photo', 'Transformation', 'Achievement', 'Question', 'Nutrition'];

const CommunityFeedPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, pagination, isLoading } = useSelector(state => state.community);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [postType, setPostType] = useState('All');

  useEffect(() => {
    const params = {
      page: 1,
      limit: 10,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(postType !== 'All' && { postType }),
    };
    dispatch(fetchFeed(params));
  }, [dispatch, debouncedSearch, postType]);

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      const params = {
        page: pagination.page + 1,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(postType !== 'All' && { postType }),
      };
      dispatch(fetchFeed(params));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between sticky top-0 bg-surface/90 backdrop-blur-md py-4 z-10 border-b border-surface-border mb-4">
        <h1 className="text-2xl font-display font-bold text-white">Community</h1>
        <Link to="/community/create" className="btn-primary h-10 px-4 inline-flex items-center gap-2">
          <HiPlus /> <span className="hidden sm:inline">New Post</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search posts or hashtags..." 
            className="input pl-10 bg-surface"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input bg-surface sm:w-48"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          {POST_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
        </select>
      </div>

      {/* Feed */}
      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          No posts found. Be the first to share something!
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onCommentClick={() => navigate(`/community/post/${post._id}`)} 
            />
          ))}
          
          {pagination.page < pagination.totalPages && (
            <div className="flex justify-center pt-4 pb-12">
              <button 
                onClick={loadMore} 
                disabled={isLoading}
                className="btn-secondary h-12 px-8"
              >
                {isLoading ? <Spinner size="sm" /> : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default CommunityFeedPage;
