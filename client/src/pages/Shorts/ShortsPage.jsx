/**
 * @page ShortsPage
 * @description Vertical scrolling feed of YouTube Fitness Shorts.
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchShorts, setShortsFilters } from '../../store/slices/shortsSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import { HiLightningBolt, HiOutlineClock } from 'react-icons/hi';

const CATEGORIES = ['ALL', 'CALISTHENICS', 'STRENGTH', 'HYBRID', 'MOBILITY', 'SKILLS', 'RECOVERY', 'CONDITIONING', 'CORE', 'NUTRITION'];
const SKILLS = ['ALL', 'HANDSTAND', 'HANDSTAND PUSH-UP', 'MUSCLE-UP', 'FRONT LEVER', 'PLANCHE', 'L-SIT', 'V-SIT', 'ONE ARM HANDSTAND', 'PULL-UP', 'DIPS', 'PUSH-UP', 'PISTOL SQUAT', 'HUMAN FLAG'];
const LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];

const formatDuration = (seconds) => {
  if (!Number.isFinite(Number(seconds))) return "00:00";
  const total = Math.max(0, Math.floor(Number(seconds)));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const ShortsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { shorts, isLoading, error, filters, nextPageToken } = useSelector(state => state.shorts);
  
  // Intersection Observer for autoplay and lazy loading
  const observer = useRef(null);
  const loadMoreRef = useRef(null);
  
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Ref to hold the current fetch promise so we can abort it
  const fetchPromiseRef = useRef(null);
  
  // Stable request key ref for deduplication
  const lastRequestKeyRef = useRef(null);
  const getRequestKey = (cat, skl, diff, page) => `${cat}|${skl}|${diff}|${page || ''}`;

  useEffect(() => {
    const key = getRequestKey(filters.category, filters.skill, filters.difficulty, null);
    // Initial fetch only on mount if empty
    if (shorts.length === 0 && !isLoading && lastRequestKeyRef.current !== key) {
      lastRequestKeyRef.current = key;
      fetchPromiseRef.current = dispatch(fetchShorts({ category: filters.category, skill: filters.skill, difficulty: filters.difficulty }));
    }
    
    return () => {
      if (fetchPromiseRef.current) fetchPromiseRef.current.abort();
    };
  }, []); // Only run once on mount

  // Setup Observer for video playback (play when 60% in view)
  useEffect(() => {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveVideoId(entry.target.dataset.id);
        }
      });
    }, { threshold: 0.6 });

    const videoElements = document.querySelectorAll('.short-video-container');
    videoElements.forEach(el => videoObserver.observe(el));

    return () => {
      videoElements.forEach(el => videoObserver.unobserve(el));
      videoObserver.disconnect();
    };
  }, [shorts]); // Re-bind when shorts array changes

  // Setup Observer for infinite scroll
  useEffect(() => {
    if (isLoading || error) return; // EARLY RETURN ON ERROR
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageToken) {
        const key = getRequestKey(filters.category, filters.skill, filters.difficulty, nextPageToken);
        if (lastRequestKeyRef.current === key && isLoading) return; // Prevent duplicate requests
        
        lastRequestKeyRef.current = key;
        dispatch(fetchShorts({ category: filters.category, skill: filters.skill, difficulty: filters.difficulty, pageToken: nextPageToken }));
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, error, nextPageToken, dispatch, filters]);

  const handleFilterChange = (type, value) => {
    if (filters[type] === value) return; // Prevent duplicate requests for same filter
    
    const newFilters = { ...filters, [type]: value };
    const key = getRequestKey(newFilters.category, newFilters.skill, newFilters.difficulty, null);
    
    if (lastRequestKeyRef.current === key && isLoading) return; // Prevent duplicate request
    
    // Cancel any ongoing fetch before starting a new one
    if (fetchPromiseRef.current) {
      fetchPromiseRef.current.abort();
    }
    
    lastRequestKeyRef.current = key;
    dispatch(setShortsFilters({ [type]: value }));
    
    fetchPromiseRef.current = dispatch(fetchShorts({ 
      category: newFilters.category, 
      skill: newFilters.skill,
      difficulty: newFilters.difficulty
    }));
  };

  const handleClearFilters = () => {
    if (filters.category === 'ALL' && filters.skill === 'ALL' && filters.difficulty === 'ALL') return;
    
    const key = getRequestKey('ALL', 'ALL', 'ALL', null);
    if (lastRequestKeyRef.current === key && isLoading) return;
    
    if (fetchPromiseRef.current) fetchPromiseRef.current.abort();
    
    lastRequestKeyRef.current = key;
    dispatch(setShortsFilters({ category: 'ALL', skill: 'ALL', difficulty: 'ALL' }));
    fetchPromiseRef.current = dispatch(fetchShorts({ category: 'ALL', skill: 'ALL', difficulty: 'ALL' }));
  };

  return (
    <div className="h-full flex-1 w-full flex flex-col bg-background overflow-hidden relative">
      
      {/* ─── FILTERS HEADER ────────────────────────────────────────────────── */}
      <div className="shrink-0 z-20 bg-background/90 backdrop-blur-xl border-b border-surface-border py-3 shadow-lg relative w-full overflow-hidden">
        
        {/* Subtle Fade Indicators to imply scrollability on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 md:hidden"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 md:hidden"></div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap w-full px-3 relative z-0 scroll-smooth">
          {/* ALL Button */}
          <button 
            onClick={handleClearFilters}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              filters.category === 'ALL' && filters.skill === 'ALL' && filters.difficulty === 'ALL'
                ? 'bg-brand-500/20 border border-brand-500 text-brand-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                : 'bg-surface/50 border border-surface-border text-slate-400 hover:text-white hover:bg-surface hover:border-brand-500/30'
            }`}
          >
            ALL
          </button>
          
          {/* Categories */}
          {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
            <button
              key={`cat-${cat}`}
              onClick={() => handleFilterChange('category', cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filters.category === cat 
                  ? 'bg-brand-500/20 border border-brand-500 text-brand-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                  : 'bg-surface/50 border border-surface-border text-slate-400 hover:text-white hover:bg-surface hover:border-brand-500/30'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Skills */}
          {SKILLS.filter(s => s !== 'ALL').map(skill => (
            <button
              key={`skill-${skill}`}
              onClick={() => handleFilterChange('skill', skill)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filters.skill === skill 
                  ? 'bg-blue-500/20 border border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
                  : 'bg-surface/50 border border-surface-border text-slate-400 hover:text-white hover:bg-surface hover:border-blue-500/30'
              }`}
            >
              {skill}
            </button>
          ))}

          {/* Levels */}
          {LEVELS.filter(l => l !== 'ALL').map(level => (
            <button
              key={`level-${level}`}
              onClick={() => handleFilterChange('difficulty', level)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filters.difficulty === level 
                  ? 'bg-purple-500/20 border border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                  : 'bg-surface/50 border border-surface-border text-slate-400 hover:text-white hover:bg-surface hover:border-purple-500/30'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* ─── VERTICAL FEED ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory relative scroll-smooth no-scrollbar w-full">
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-50 bg-background/90 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Fitness Shorts are temporarily unavailable.</h2>
            <p className="text-slate-400 mb-6 max-w-md">The YouTube API may be experiencing issues or rate limits. Please try again later.</p>
            <button onClick={() => {
              if (fetchPromiseRef.current) fetchPromiseRef.current.abort();
              fetchPromiseRef.current = dispatch(fetchShorts({ category: filters.category, skill: filters.skill, difficulty: filters.difficulty }));
            }} className="btn-primary">
              Retry
            </button>
          </div>
        )}

        {!error && shorts.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <h2 className="text-xl font-bold text-white mb-2">No fitness shorts found.</h2>
            <p className="mb-6">Try another skill or category combination.</p>
            <button 
              onClick={handleClearFilters} 
              className="px-4 py-2 bg-surface border border-surface-border rounded-lg hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {shorts.map((short) => {
           // If it is the active video, load the iframe, otherwise load a thumbnail overlay to save resources
           const isActive = activeVideoId === short.id;
           
           return (
             <div 
               key={short.id} 
               data-id={short.id}
               className="short-video-container snap-start snap-always w-full h-full flex items-center justify-center relative bg-black/95 p-2 md:p-6 lg:p-8"
             >
               <div className="relative w-full max-w-md h-full md:h-[90%] md:rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center border border-white/5 group">
                 
                 {/* Video Player or Thumbnail */}
                 {isActive ? (
                   <iframe
                     className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
                     src={short.embedUrl}
                     title={short.title}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={() => setActiveVideoId(short.id)}>
                     <img src={short.thumbnailUrl} alt={short.title} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                         <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Video Meta Overlay (Bottom) */}
                 <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                      {filters.category !== 'ALL' && <span className="badge bg-brand-500/20 text-brand-400 border-brand-500/30 text-[10px] pointer-events-auto cursor-pointer">{filters.category}</span>}
                      {filters.skill !== 'ALL' && <span className="badge bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] pointer-events-auto cursor-pointer">{filters.skill}</span>}
                      {filters.difficulty !== 'ALL' && <span className="badge bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] pointer-events-auto cursor-pointer">{filters.difficulty}</span>}
                    </div>
                    <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2 mb-1 drop-shadow-md">{short.title || 'Untitled'}</h3>
                    <p className="text-slate-300 text-sm font-medium drop-shadow-md">@{short.channelTitle || 'Unknown Creator'}</p>
                 </div>

                 {/* Video Actions (Right Side) */}
                 <div className="absolute right-4 bottom-24 md:bottom-1/4 flex flex-col gap-4 pointer-events-auto">
                    <button onClick={() => navigate(`/shorts/${short.id}`)} className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center hover:bg-brand-500/20 hover:border-brand-500/50 transition-all group/btn shadow-xl">
                      <span className="text-white font-bold text-xs group-hover/btn:scale-110 transition-transform">i</span>
                      <span className="text-[9px] text-slate-300">Info</span>
                    </button>
                    <a href={short.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group/btn shadow-xl">
                      <div className="w-4 h-3 bg-white rounded-sm relative group-hover/btn:scale-110 transition-transform">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-red-600 border-b-[3px] border-b-transparent"></div>
                         </div>
                      </div>
                      <span className="text-[9px] text-slate-300 mt-1">YT</span>
                    </a>
                 </div>

                 {/* Top Meta (Duration) */}
                 <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-1">
                   <HiOutlineClock className="text-slate-300 w-3 h-3" />
                   <span className="text-white text-xs font-bold">{formatDuration(short.durationSeconds)}</span>
                 </div>
               </div>
             </div>
           );
        })}

        {/* Loading / Infinite Scroll trigger */}
        {((isLoading || nextPageToken) && !error) && (
          <div ref={loadMoreRef} className="snap-start w-full h-32 flex items-center justify-center pb-8">
             <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShortsPage;
