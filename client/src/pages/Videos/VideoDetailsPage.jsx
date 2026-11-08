/**
 * @page VideoDetailsPage
 * @description View embedded YouTube video with normalized metadata.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import { fetchVideoDetails } from '../../store/slices/videoFeedSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const parseDuration = (isoString) => {
  if (!isoString) return '0:00';
  const match = isoString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  const h = (match[1] || '').replace('H', '');
  const m = (match[2] || '').replace('M', '');
  const s = (match[3] || '').replace('S', '');
  
  let formatted = '';
  if (h) formatted += `${h}:`;
  formatted += `${m ? m.padStart(h ? 2 : 1, '0') : '0'}:`;
  formatted += `${s ? s.padStart(2, '0') : '00'}`;
  return formatted;
};

const VideoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeVideo: video, isLoading, error } = useSelector(state => state.videoFeed);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoDetails(id));
    }
  }, [dispatch, id]);

  if (isLoading || !video) return <FullScreenLoader />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 glass-card text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Error loading video</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => navigate('/videos')} className="btn-secondary px-6 py-2">Back to Feed</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <button 
        onClick={() => navigate('/videos')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <FiArrowLeft /> Back to Videos
      </button>

      <div className="glass-card overflow-hidden">
        {/* Video Player wrapper for responsive 16:9 ratio */}
        <div className="relative w-full pb-[56.25%] bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400 mb-6 border-b border-surface-border pb-6">
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-surface-border">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">
                {video.channelTitle?.charAt(0)}
              </span>
              <span className="text-white">{video.channelTitle}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(video.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4" />
              <span>{parseDuration(video.duration)}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-bold text-white mb-2">Description</h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
              {video.description || 'No description provided.'}
            </p>
          </div>
          
          {video.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {video.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface border border-surface-border text-slate-400 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
