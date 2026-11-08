/**
 * @page RoadmapsPage
 * @description View and navigate skill progression roadmaps.
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiLockClosed, HiPlay, HiArrowLeft, HiOutlineClock, HiLightningBolt } from 'react-icons/hi';
import { fetchRoadmaps, fetchRoadmapById } from '../../store/slices/learningSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

// Lists all roadmaps if no ID, otherwise shows specific roadmap
const RoadmapsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { roadmaps, activeRoadmap, isLoading } = useSelector(state => state.learning);
  const [userLevel, setUserLevel] = useState(3); // Mock user level. In real app, fetch from User Profile estimatedLevel.
  
  // Keep track of which step is expanded (accordion state)
  const [expandedStep, setExpandedStep] = useState(null);
  // Keep track of completed steps in UI (local state)
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchRoadmapById(id));
      setExpandedStep(null); // Reset expanded step when roadmap changes
    } else {
      dispatch(fetchRoadmaps());
    }
  }, [dispatch, id]);

  const toggleExpand = (stepId) => {
    setExpandedStep(prev => prev === stepId ? null : stepId);
  };

  const markComplete = (stepId, e) => {
    e.stopPropagation();
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: true
    }));
  };

  if (isLoading) return <FullScreenLoader />;

  // ─── LIST VIEW ─────────────────────────────────────────────────────────────
  if (!id) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-16">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-10 sm:p-14 shadow-2xl shadow-brand-900/50">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-4 tracking-tight">Skill Roadmaps</h1>
            <p className="text-brand-100 text-lg sm:text-xl leading-relaxed">Structured, step-by-step progressions to master advanced calisthenics, flexibility, and fitness skills.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps.map(rm => (
            <Link key={rm.id} to={`/learning/roadmaps/${rm.id}`} className="glass-card p-8 flex flex-col hover:border-brand-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300">
                  <span className="font-bold text-2xl">{rm.steps?.length || 0}</span>
                </div>
                <span className="badge badge-blue">{rm.difficulty || 'All Levels'}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{rm.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6">{rm.description}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <HiOutlineClock className="w-4 h-4" />
                  Estimated: {rm.estimatedDuration || 'Varies'}
                </div>
                <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full w-[0%]"></div>
                </div>
                <div className="text-brand-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  Start Roadmap &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ─── DETAIL VIEW (VERTICAL TIMELINE) ───────────────────────────────────────
  if (!activeRoadmap) return <div className="text-center p-12 text-white">Roadmap not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <button onClick={() => navigate('/learning/roadmaps')} className="px-4 py-2 bg-surface border border-surface-border rounded-xl text-slate-300 hover:text-white hover:bg-surface-border hover:border-brand-500/50 flex items-center gap-2 w-fit transition-all shadow-lg">
        <HiArrowLeft /> Back to Roadmaps
      </button>

      <div className="glass-card p-8 sm:p-10 relative overflow-hidden border-brand-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
          <div className="max-w-2xl">
            <span className="badge badge-blue mb-4 block w-fit">{activeRoadmap.category}</span>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-4 tracking-tight">{activeRoadmap.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">{activeRoadmap.description}</p>
          </div>
          <div className="flex flex-col gap-4 shrink-0 justify-center">
             <div className="bg-surface/50 p-4 rounded-xl border border-surface-border">
               <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Estimated Journey</p>
               <p className="text-white font-bold text-lg flex items-center gap-2"><HiOutlineClock className="text-brand-400"/> {activeRoadmap.estimatedDuration || 'Varies'}</p>
             </div>
             <div className="bg-surface/50 p-4 rounded-xl border border-surface-border">
               <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Difficulty</p>
               <p className="text-white font-bold text-lg flex items-center gap-2"><HiLightningBolt className="text-yellow-400"/> {activeRoadmap.difficulty || 'All Levels'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="relative ml-4 sm:ml-8 mt-12">
        {/* The Vertical Line */}
        <div className="absolute top-4 bottom-4 left-[15px] sm:left-[19px] w-1 bg-gradient-to-b from-brand-500 via-brand-700 to-surface-border rounded-full"></div>

        <div className="space-y-12">
          {activeRoadmap.steps.map((step) => {
            const isUnlocked = step.estimatedLevel <= userLevel + 2; 
            const isExpanded = expandedStep === step.id;
            const isCompleted = completedSteps[step.id] || false;
            
            return (
              <div key={step.id} className="relative pl-12 sm:pl-16 group">
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors duration-300 ${
                  isCompleted ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' :
                  isUnlocked ? 'bg-brand-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-surface-border'
                }`}>
                  {!isUnlocked ? <HiLockClosed className="text-slate-500 w-4 h-4" /> : 
                   isCompleted ? <HiCheckCircle className="text-white w-5 h-5" /> :
                   <span className="text-white font-bold text-xs sm:text-sm">{step.stepNumber}</span>}
                </div>

                <div 
                  onClick={() => toggleExpand(step.id)}
                  className={`glass-card overflow-hidden transition-all duration-300 cursor-pointer ${
                    isUnlocked ? 'hover:border-brand-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'opacity-70 hover:opacity-100 hover:border-surface-border/80'
                  } ${isExpanded && isUnlocked ? 'border-brand-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : ''}`}
                >
                  {/* Card Header */}
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isCompleted ? 'text-green-400' : isUnlocked ? 'text-brand-400' : 'text-slate-500'}`}>
                        {isCompleted ? '✓ Completed' : `Step ${step.stepNumber}`}
                      </p>
                      <h3 className={`text-xl sm:text-2xl font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {step.name}
                      </h3>
                      {isUnlocked && <p className="text-slate-400 mt-2 text-sm">{step.level}</p>}
                    </div>
                    
                    {isUnlocked && (
                      <div className="shrink-0 text-brand-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        {isExpanded ? 'Collapse' : 'View Details &rarr;'}
                      </div>
                    )}
                  </div>

                  {/* Expandable Content (Unlocked) */}
                  {isUnlocked && isExpanded && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-surface-border/50 bg-black/20" onClick={(e) => e.stopPropagation()}>
                      
                      <div className="mt-6 mb-8">
                        <h4 className="text-brand-300 font-bold mb-2">What This Builds</h4>
                        <p className="text-slate-300 leading-relaxed">{step.whatItBuilds}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">📝</span>
                            How To Perform
                          </h4>
                          <ol className="space-y-3 text-slate-300 text-sm list-decimal list-inside">
                            {step.howTo?.map((instruction, i) => (
                              <li key={i} className="pl-2 leading-relaxed marker:text-brand-500 marker:font-bold">{instruction}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="space-y-4 bg-surface/50 p-5 rounded-xl border border-surface-border">
                          <div className="flex justify-between border-b border-surface-border pb-2">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Sets</span>
                            <span className="text-white font-bold">{step.sets}</span>
                          </div>
                          <div className="flex justify-between border-b border-surface-border pb-2">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Reps / Hold</span>
                            <span className="text-white font-bold">{step.reps}</span>
                          </div>
                          <div className="flex justify-between border-b border-surface-border pb-2">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Rest</span>
                            <span className="text-white font-bold">{step.rest}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Estimated Time</span>
                            <span className="text-white font-bold">{step.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {step.commonMistakes?.length > 0 && (
                          <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
                            <h4 className="text-red-400 font-bold mb-3 text-sm uppercase tracking-wider">Common Mistakes</h4>
                            <ul className="space-y-2 text-slate-300 text-sm">
                              {step.commonMistakes.map((mistake, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl flex flex-col justify-between">
                          <div>
                            <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">Move to next step when</h4>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">{step.progressionCriteria}</p>
                          </div>
                          {step.regression && (
                            <div>
                              <h4 className="text-slate-400 font-bold mb-1 text-xs uppercase tracking-wider">Too hard? Try:</h4>
                              <p className="text-slate-300 text-sm">{step.regression}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {step.recommendedVideos?.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <HiPlay className="w-4 h-4" /> Recommended Tutorials
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {step.recommendedVideos.map(video => (
                              <Link key={video._id} to={`/learning/video/${video._id}`} className="flex flex-col gap-3 group/video bg-surface p-3 rounded-xl border border-surface-border hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shrink-0 shadow-md">
                                  <img src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`} alt="thumb" className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                    <HiPlay className="text-white w-8 h-8" />
                                  </div>
                                </div>
                                <p className="text-sm font-bold text-slate-300 line-clamp-2 group-hover/video:text-white transition-colors">{video.title}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end border-t border-surface-border/50 pt-6 mt-4">
                        {!isCompleted ? (
                           <button onClick={(e) => markComplete(step.id, e)} className="btn-primary flex items-center gap-2">
                             <HiCheckCircle className="w-5 h-5" /> Mark as Complete
                           </button>
                        ) : (
                           <div className="px-6 py-2.5 rounded-xl bg-green-500/20 text-green-400 font-bold flex items-center gap-2 border border-green-500/30">
                             <HiCheckCircle className="w-5 h-5" /> Completed
                           </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Expandable Content (Locked) */}
                  {!isUnlocked && isExpanded && (
                    <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-surface-border/50 bg-black/20" onClick={(e) => e.stopPropagation()}>
                       <div className="bg-surface border border-surface-border p-6 rounded-xl text-center">
                         <div className="w-12 h-12 bg-surface-border rounded-full flex items-center justify-center mx-auto mb-4">
                           <HiLockClosed className="text-slate-400 w-6 h-6" />
                         </div>
                         <h4 className="text-white font-bold text-lg mb-2">Locked Step</h4>
                         <p className="text-slate-400 mb-6 max-w-md mx-auto">
                           You need to build more fundamental strength before attempting this skill to avoid injury and ensure proper form.
                         </p>
                         <div className="inline-block bg-surface-border/50 px-4 py-3 rounded-lg border border-surface-border">
                           <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Prerequisite Goal</p>
                           <p className="text-slate-300 text-sm">Reach Level {step.estimatedLevel - 2} to unlock the details for this progression.</p>
                         </div>
                       </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapsPage;
