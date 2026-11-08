/**
 * @page LearningHomePage
 * @description The main discovery hub for fitness education.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiPlay, HiCollection, HiBookOpen } from 'react-icons/hi';
import { fetchVideos, fetchRoadmaps } from '../../store/slices/learningSlice.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';
import VideoCard from '../../components/learning/VideoCard.jsx';

const CATEGORIES = ['All', 'Handstand', 'Mobility', 'Muscle Up', 'Planche', 'Nutrition', 'Core', 'Stretching'];

const LearningHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { videos, roadmaps, isLoading } = useSelector(state => state.learning);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchVideos({ limit: 12 })); // Initial load
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      dispatch(fetchVideos({ limit: 12 }));
    } else {
      dispatch(fetchVideos({ category: cat, limit: 12 }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/learning/search?q=${encodeURIComponent(search)}`);
    }
  };

  if (isLoading && videos.length === 0) return <FullScreenLoader />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      
      {/* Hero Section */}
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-8 sm:p-14 shadow-2xl shadow-brand-900/50">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white mb-6 tracking-tight">Fitness Learning Hub</h1>
          <p className="text-brand-100 text-lg sm:text-xl mb-10 leading-relaxed max-w-xl">Master new skills, improve your mobility, and understand nutrition with curated, distraction-free education.</p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl group">
            <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search skills, tutorials, topics..." 
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white/20 transition-all focus:outline-none shadow-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Link to="/learning/roadmaps" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] group transition-all duration-300">
          <div className="w-14 h-14 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300"><HiBookOpen className="w-7 h-7" /></div>
          <h3 className="font-bold text-white text-lg">Skill Roadmaps</h3>
          <p className="text-xs text-slate-400 mt-1">Structured paths</p>
        </Link>
        <Link to="/learning/library" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:border-accent-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group transition-all duration-300">
          <div className="w-14 h-14 bg-accent-500/10 text-accent-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent-500/20 transition-all duration-300"><HiCollection className="w-7 h-7" /></div>
          <h3 className="font-bold text-white text-lg">My Library</h3>
          <p className="text-xs text-slate-400 mt-1">Saved & History</p>
        </Link>
        {/* Can add more quick links if needed */}
      </div>

      {/* Categories Filter */}
      <div>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`snap-start shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-transparent' 
                  : 'bg-surface border border-surface-border text-slate-300 hover:border-brand-500/50 hover:text-white hover:bg-surface-border/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeCategory === 'All' ? 'Featured Videos' : `${activeCategory} Videos`}
          </h2>
          <Link to={`/learning/search?category=${activeCategory}`} className="text-sm font-bold text-brand-400 hover:text-brand-300">View All</Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : videos.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400">No videos found for this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>

      {/* Roadmaps Preview */}
      {roadmaps.length > 0 && activeCategory === 'All' && (
        <div className="pt-10 border-t border-surface-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Popular Roadmaps</h2>
            <Link to="/learning/roadmaps" className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Explore All <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmaps.slice(0,3).map(roadmap => (
              <Link key={roadmap.id} to={`/learning/roadmaps/${roadmap.id}`} className="glass-card p-8 block hover:border-brand-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group transition-all duration-300">
                <div className="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-xl">{roadmap.steps?.length || 0}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">{roadmap.title}</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">{roadmap.description}</p>
                <div className="flex items-center gap-2 text-brand-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  View Path &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningHomePage;
