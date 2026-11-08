/**
 * @page UserLibraryPage
 * @description View saved videos and watch history.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiCollection, HiHeart, HiClock, HiTrash } from 'react-icons/hi';
import { fetchUserLibrary, clearHistory } from '../../store/slices/learningSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import VideoCard from '../../components/learning/VideoCard.jsx';

const UserLibraryPage = () => {
  const dispatch = useDispatch();
  const { favorites, watchLater, history, isLoading } = useSelector(state => state.learning);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    dispatch(fetchUserLibrary());
  }, [dispatch]);

  if (isLoading) return <FullScreenLoader />;

  const renderVideos = (videos) => {
    if (!videos || videos.length === 0) {
      return <div className="glass-card p-12 text-center text-slate-400">No videos found in this section.</div>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(item => {
          // Handle history nested object vs direct reference for favorites
          const video = item.video || item;
          if (!video || !video._id) return null;
          return <VideoCard key={video._id + Math.random()} video={video} />;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent-500/10 text-accent-500 rounded-xl flex items-center justify-center">
          <HiCollection className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">My Library</h1>
          <p className="text-slate-400">Your personal collection of fitness knowledge.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-surface-border pb-4">
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === 'favorites' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-surface-border'}`}
        >
          <HiHeart /> Saved
        </button>
        <button 
          onClick={() => setActiveTab('watchLater')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === 'watchLater' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-surface-border'}`}
        >
          <HiClock /> Watch Later
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === 'history' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-surface-border'}`}
        >
          History
        </button>
      </div>

      {activeTab === 'history' && history?.length > 0 && (
        <div className="flex justify-end mb-4 -mt-4">
          <button 
            onClick={() => { if(window.confirm('Clear history?')) dispatch(clearHistory()); }}
            className="text-sm font-bold text-slate-400 hover:text-red-400 flex items-center gap-1"
          >
            <HiTrash /> Clear History
          </button>
        </div>
      )}

      {activeTab === 'favorites' && renderVideos(favorites)}
      {activeTab === 'watchLater' && renderVideos(watchLater)}
      {activeTab === 'history' && renderVideos(history)}

    </div>
  );
};

export default UserLibraryPage;
