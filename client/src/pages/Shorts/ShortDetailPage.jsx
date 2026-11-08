import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShortDetails, clearActiveShort } from '../../store/slices/shortsSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import { HiArrowLeft, HiOutlineClock, HiPlay, HiLightningBolt } from 'react-icons/hi';

// Known skills in Learning Hub roadmap to map dynamically
const ROADMAP_SKILLS = {
  'handstand': 'handstand',
  'muscle-up': 'muscle-up',
  'planche': 'planche',
  'front lever': 'front-lever',
  'handstand push-up': 'hspu',
  'hspu': 'hspu',
  'l-sit': 'l-sit',
  'v-sit': 'v-sit',
  'one arm handstand': 'one-arm-handstand',
  'human flag': 'human-flag',
  'pistol squat': 'pistol-squat'
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(Number(seconds))) return "00:00";
  const total = Math.max(0, Math.floor(Number(seconds)));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const ShortDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeShort, isLoading, error } = useSelector(state => state.shorts);

  useEffect(() => {
    dispatch(fetchShortDetails(id));
    return () => dispatch(clearActiveShort());
  }, [dispatch, id]);

  if (isLoading) return <FullScreenLoader />;
  if (error || !activeShort) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold text-white mb-2">Failed to load Short details</h2>
        <p className="text-slate-400 mb-6">{error || 'Video not found'}</p>
        <button onClick={() => navigate('/shorts')} className="btn-primary">Back to Shorts</button>
      </div>
    );
  }

  // Attempt to match a roadmap
  let matchedRoadmapId = null;
  if (activeShort.tags) {
    for (const tag of activeShort.tags) {
       const cleanTag = tag.toLowerCase().replace(/calisthenics|workout|fitness|shorts/g, '').trim();
       if (ROADMAP_SKILLS[cleanTag]) {
         matchedRoadmapId = ROADMAP_SKILLS[cleanTag];
         break;
       }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <button 
        onClick={() => navigate('/shorts')} 
        className="px-4 py-2 bg-surface border border-surface-border rounded-xl text-slate-300 hover:text-white hover:bg-surface-border hover:border-brand-500/50 flex items-center gap-2 w-fit transition-all shadow-lg"
      >
        <HiArrowLeft /> Back to Feed
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Video Player */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-surface-border shadow-2xl relative">
            <iframe
               className="absolute inset-0 w-full h-full object-cover"
               src={activeShort.embedUrl}
               title={activeShort.title}
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 space-y-8 py-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="badge badge-green">FITNESS SHORTS</span>
              <div className="flex items-center gap-1 text-slate-400 text-sm font-bold">
                <HiOutlineClock className="w-4 h-4" />
                {formatDuration(activeShort.durationSeconds)}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-4 leading-tight">
              {activeShort.title}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-surface-border flex items-center justify-center font-bold text-white text-lg">
                {activeShort.channelTitle?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-bold">{activeShort.channelTitle}</p>
                <p className="text-slate-400 text-sm">{new Date(activeShort.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-brand-500/50 pl-4 py-1">
              {activeShort.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-surface-border">
            {/* Learning Hub Connection */}
            {matchedRoadmapId ? (
              <button 
                onClick={() => navigate(`/learning/roadmaps/${matchedRoadmapId}`)}
                className="flex-1 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3 group"
              >
                <HiLightningBolt className="w-6 h-6 group-hover:scale-110 transition-transform text-yellow-300" />
                Learn This Skill
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/learning/roadmaps`)}
                className="flex-1 px-6 py-4 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 hover:border-brand-500/60 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
              >
                Explore Roadmaps
              </button>
            )}

            <a 
              href={activeShort.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-6 py-4 bg-surface border border-surface-border hover:border-red-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-red-500/5"
            >
              <HiPlay className="w-6 h-6 text-red-500" />
              Watch on YouTube
            </a>
          </div>

          {activeShort.tags?.length > 0 && (
            <div className="pt-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {activeShort.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-surface border border-surface-border rounded-lg text-xs font-bold text-slate-400">
                    #{tag.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShortDetailPage;
