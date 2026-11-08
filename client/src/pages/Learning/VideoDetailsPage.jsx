/**
 * @page VideoDetailsPage
 * @description Renders a YouTube iframe and metadata, plus related videos.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowLeft, HiHeart, HiOutlineHeart, HiOutlineClock, HiClock } from 'react-icons/hi';
import { fetchVideoById, toggleFavorite, toggleWatchLater } from '../../store/slices/learningSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import VideoCard from '../../components/learning/VideoCard.jsx';
import useAuth from '../../hooks/useAuth.js';

const VideoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { activeVideo: video, relatedVideos, favorites, watchLater, isLoading } = useSelector(state => state.learning);
  
  const [isFav, setIsFav] = useState(false);
  const [isWL, setIsWL] = useState(false);

  useEffect(() => {
    dispatch(fetchVideoById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (video) {
      setIsFav(favorites.some(v => v._id === video._id || v === video._id));
      setIsWL(watchLater.some(v => v._id === video._id || v === video._id));
    }
  }, [video, favorites, watchLater]);

  const handleToggleFavorite = () => {
    setIsFav(!isFav);
    dispatch(toggleFavorite(video._id));
  };

  const handleToggleWatchLater = () => {
    setIsWL(!isWL);
    dispatch(toggleWatchLater(video._id));
  };

  if (isLoading || !video) return <FullScreenLoader />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <HiArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* YouTube Player */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <iframe 
              src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Details */}
          <div className="glass-card p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-blue">{video.category}</span>
              <span className={`badge ${video.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/20' : video.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                {video.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{video.title}</h1>
            <p className="text-slate-400 font-bold mb-6">{video.channelName}</p>

            <div className="flex flex-wrap items-center gap-4 border-b border-surface-border pb-6 mb-6">
              <button 
                onClick={handleToggleFavorite}
                className={`btn-secondary flex items-center gap-2 ${isFav ? 'bg-brand-500/10 text-brand-400 border-brand-500/30' : ''}`}
              >
                {isFav ? <HiHeart className="w-5 h-5 text-brand-500" /> : <HiOutlineHeart className="w-5 h-5" />}
                {isFav ? 'Saved' : 'Save'}
              </button>
              
              <button 
                onClick={handleToggleWatchLater}
                className={`btn-secondary flex items-center gap-2 ${isWL ? 'bg-accent-500/10 text-accent-400 border-accent-500/30' : ''}`}
              >
                {isWL ? <HiClock className="w-5 h-5 text-accent-500" /> : <HiOutlineClock className="w-5 h-5" />}
                {isWL ? 'In Watch Later' : 'Watch Later'}
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-slate-300">{video.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white mb-4">Related Videos</h3>
          
          {relatedVideos.length === 0 ? (
            <p className="text-slate-500 text-sm">No related videos found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {relatedVideos.map(rv => (
                <VideoCard key={rv._id} video={rv} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VideoDetailsPage;
