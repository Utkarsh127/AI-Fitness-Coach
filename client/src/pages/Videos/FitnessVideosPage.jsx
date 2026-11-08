/**
 * @page FitnessVideosPage
 * @description YouTube Fitness Video discovery feed.
 */

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import { fetchFitnessVideos, clearVideos } from '../../store/slices/videoFeedSlice.js';
import { Spinner } from '../../components/common/Loader.jsx';
import VideoCard from '../../components/learning/VideoCard.jsx';
import useDebounce from '../../hooks/useDebounce.js';

const CATEGORIES = ['All', 'Strength', 'Calisthenics', 'Mobility', 'Skills', 'Recovery'];

const FitnessVideosPage = () => {
  const dispatch = useDispatch();
  const { videos, isLoading, hasMore, nextPageToken, error } = useSelector(state => state.videoFeed);
  
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const debouncedSearch = useDebounce(searchInput, 600);

  // Fetch videos when search or category changes
  useEffect(() => {
    dispatch(clearVideos());
    
    let q = debouncedSearch;
    if (activeCategory !== 'All') {
      q = q ? `${q} ${activeCategory}` : activeCategory;
    }
    
    dispatch(fetchFitnessVideos({ q, maxResults: 12 }));
  }, [dispatch, debouncedSearch, activeCategory]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    let q = debouncedSearch;
    if (activeCategory !== 'All') {
      q = q ? `${q} ${activeCategory}` : activeCategory;
    }
    
    dispatch(fetchFitnessVideos({ q, pageToken: nextPageToken, maxResults: 12 }));
  }, [dispatch, debouncedSearch, activeCategory, nextPageToken, hasMore, isLoading]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="glass-card p-6 md:p-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Fitness Videos</h1>
        <p className="text-slate-400 mb-6">Discover the best fitness content and educational tutorials.</p>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search fitness videos (e.g. handstand push ups)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-surface-border/50 border border-surface-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wider uppercase transition-colors ${
                activeCategory === cat 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-surface-border/50 text-slate-400 hover:text-white hover:bg-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Video Grid */}
      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard 
                key={video.videoId} 
                video={video} 
                basePath="/videos" 
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8">
              <button 
                onClick={loadMore} 
                disabled={isLoading}
                className="btn-secondary px-8 h-12 min-w-[160px]"
              >
                {isLoading ? <Spinner size="sm" /> : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        !isLoading && !error && (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400 mb-2">No videos found for your search.</p>
            <p className="text-sm text-slate-500">Try checking a different category or search term.</p>
          </div>
        )
      )}

      {isLoading && videos.length === 0 && (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      )}
    </div>
  );
};

export default FitnessVideosPage;
