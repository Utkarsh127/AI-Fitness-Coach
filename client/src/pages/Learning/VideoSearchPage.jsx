/**
 * @page VideoSearchPage
 * @description Search results for videos.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchVideos } from '../../store/slices/learningSlice.js';
import { Spinner } from '../../components/common/Loader.jsx';
import VideoCard from '../../components/learning/VideoCard.jsx';

const VideoSearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const { videos, pagination, isLoading } = useSelector(state => state.learning);

  useEffect(() => {
    const params = { limit: 20, page: 1 };
    if (q) params.search = q;
    if (category) params.category = category;
    
    dispatch(fetchVideos(params));
  }, [dispatch, q, category]);

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      const params = { limit: 20, page: pagination.page + 1 };
      if (q) params.search = q;
      if (category) params.category = category;
      dispatch(fetchVideos(params));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="glass-card p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {q ? `Search results for "${q}"` : category ? `${category} Videos` : 'All Videos'}
        </h1>
        <p className="text-slate-400">Found {pagination.totalPages > 0 ? 'matching' : '0'} videos.</p>
      </div>

      {isLoading && videos.length === 0 ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : videos.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">No videos found. Try a different search term or category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {pagination.page < pagination.totalPages && (
        <div className="flex justify-center pt-8">
          <button onClick={loadMore} disabled={isLoading} className="btn-secondary px-8 h-12">
            {isLoading ? <Spinner size="sm" /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoSearchPage;
