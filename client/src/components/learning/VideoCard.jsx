/**
 * @component VideoCard
 * @description Responsive video card component for the learning hub.
 */

import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineTag } from 'react-icons/hi';

const formatDuration = (duration) => {
  if (!duration) return '0:00';
  
  if (!isNaN(duration)) {
    const totalSeconds = Number(duration);
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (typeof duration === 'string' && duration.startsWith('PT')) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return '0:00';
};

const VideoCard = ({ video, basePath = '/learning/video' }) => {
  // Use videoId for YouTube direct feed, or _id for Learning Hub
  const targetId = video._id || video.videoId;
  const linkUrl = video.to || `${basePath}/${targetId}`;

  return (
    <Link to={linkUrl} className="group block h-full">
      <div className="glass-card h-full flex flex-col overflow-hidden hover:border-brand-500/50 transition-colors">
        
        {/* Thumbnail Area */}
        <div className="relative aspect-video bg-surface-border overflow-hidden shrink-0">
          <img 
            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeVideoId || video.videoId}/maxresdefault.jpg`} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://img.youtube.com/vi/${video.youtubeVideoId || video.videoId}/hqdefault.jpg`; }}
          />
          
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 backdrop-blur-sm">
            <HiOutlineClock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>

          {video.isFeatured && (
            <div className="absolute top-2 left-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Featured
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider
              ${video.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : 
                video.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 
                video.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' : 
                'bg-slate-500/20 text-slate-400'}`}>
              {video.difficulty || 'All Levels'}
            </span>
            <span className="text-[10px] px-2 py-1 rounded bg-surface-border text-slate-300 uppercase tracking-wider font-bold">
              {video.category}
            </span>
          </div>

          <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
            {video.title}
          </h3>
          
          <p className="text-xs text-slate-400 mb-3 line-clamp-1">{video.channelName || video.channelTitle}</p>
          
          {video.tags?.length > 0 && (
            <div className="mt-auto flex items-center gap-2 text-xs text-slate-500 truncate pt-2 border-t border-surface-border/50">
              <HiOutlineTag className="w-3 h-3 shrink-0" />
              <span className="truncate">{video.tags.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
};

export default VideoCard;
