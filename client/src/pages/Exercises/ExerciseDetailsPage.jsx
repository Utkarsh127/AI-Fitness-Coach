/**
 * @page ExerciseDetailsPage
 * @description Detailed view of a single exercise with rich programming data.
 */

import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowLeft, HiPlay, HiCheckCircle, HiExclamationCircle, HiLightningBolt } from 'react-icons/hi';
import { fetchExerciseDetails, clearCurrentExercise } from '../../store/slices/exerciseSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

const ExerciseDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentExercise: exercise, isLoading } = useSelector(state => state.exercise);

  useEffect(() => {
    if (slug) {
      dispatch(fetchExerciseDetails(slug));
    }
    return () => { dispatch(clearCurrentExercise()); };
  }, [dispatch, slug]);

  if (isLoading || !exercise) return <FullScreenLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-brand-400 flex items-center gap-2 font-medium transition-colors">
        <HiArrowLeft /> Back to Library
      </button>

      {/* Header Info */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight uppercase">{exercise.name}</h1>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/20 font-bold tracking-widest uppercase">
            {exercise.difficulty}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium uppercase tracking-wider text-sm">
            {exercise.muscleGroups?.join(' • ')}
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-[21/9] md:aspect-[2.5/1] bg-surface-border rounded-3xl overflow-hidden relative shadow-2xl shadow-black/50 border border-surface-border">
        {exercise.imageUrl ? (
          <img 
            src={exercise.imageUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400' fill='%231E293B'%3E%3Crect width='1200' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2364748B' font-family='sans-serif' font-size='24px' font-weight='bold' font-style='normal'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-brand-500/5">
            <span className="uppercase tracking-wider font-bold text-brand-300">Image Unavailable</span>
          </div>
        )}
        
        {exercise.videoUrl && (
          <div className="absolute bottom-4 right-4">
            <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="btn-primary shadow-lg flex items-center gap-2">
              <HiPlay className="w-5 h-5" /> Watch Tutorial
            </a>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Content) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* About */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HiLightningBolt className="text-brand-500" /> About
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              {exercise.detailedDescription || exercise.description}
            </p>
          </section>

          {/* Benefits */}
          {exercise.benefits && exercise.benefits.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exercise.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-surface p-4 rounded-xl border border-surface-border">
                    <HiCheckCircle className="text-brand-500 w-6 h-6 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How to Perform */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">How to Perform</h2>
            <div className="glass-card p-6 md:p-8">
              <ol className="space-y-6">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Common Mistakes */}
          {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
                <HiExclamationCircle /> Common Mistakes
              </h2>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
                <ul className="space-y-3">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <span className="text-orange-500 font-bold mt-0.5">•</span> {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 6-Week Expectation */}
          {exercise.expectedImprovements && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">6-Week Expectation</h2>
              <div className="glass-card p-6 border-l-4 border-l-brand-500">
                <p className="text-slate-300 leading-relaxed italic">
                  "{exercise.expectedImprovements}"
                </p>
              </div>
            </section>
          )}
          
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          
          {/* Muscles & Equipment */}
          <div className="glass-card p-6 space-y-6">
            {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.primaryMuscles.map(m => (
                    <span key={m} className="px-3 py-1 bg-surface-border text-slate-300 text-sm font-medium rounded-lg">{m}</span>
                  ))}
                </div>
              </div>
            )}
            
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Secondary Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map(m => (
                    <span key={m} className="px-3 py-1 bg-surface border border-surface-border text-slate-400 text-sm rounded-lg">{m}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment?.length > 0 ? exercise.equipment.map(e => (
                  <span key={e} className="px-3 py-1 bg-surface-border text-brand-300 font-medium text-sm rounded-lg">{e}</span>
                )) : (
                  <span className="text-slate-400 text-sm italic">Bodyweight</span>
                )}
              </div>
            </div>
          </div>

          {/* Training Recommendations */}
          {exercise.programming && (
            <div className="glass-card p-1">
              <div className="bg-surface p-4 rounded-t-xl border-b border-surface-border">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">Training Recommendations</h3>
              </div>
              
              <div className="divide-y divide-surface-border">
                {/* Beginner */}
                {exercise.programming.beginner?.reps && (
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Beginner</span>
                      <span className="text-sm font-medium text-slate-300">{exercise.programming.beginner.sets} × {exercise.programming.beginner.reps}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">Rest: {exercise.programming.beginner.rest}</p>
                    <p className="text-sm text-slate-300">Variation: <span className="text-white font-medium">{exercise.programming.beginner.variation}</span></p>
                  </div>
                )}
                
                {/* Intermediate */}
                {exercise.programming.intermediate?.reps && (
                  <div className="p-5 bg-surface-border/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Intermediate</span>
                      <span className="text-sm font-medium text-slate-300">{exercise.programming.intermediate.sets} × {exercise.programming.intermediate.reps}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">Rest: {exercise.programming.intermediate.rest}</p>
                    <p className="text-sm text-slate-300">Variation: <span className="text-white font-medium">{exercise.programming.intermediate.variation}</span></p>
                  </div>
                )}

                {/* Advanced */}
                {exercise.programming.advanced?.reps && (
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Advanced</span>
                      <span className="text-sm font-medium text-slate-300">{exercise.programming.advanced.sets} × {exercise.programming.advanced.reps}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">Rest: {exercise.programming.advanced.rest}</p>
                    <p className="text-sm text-slate-300">Variation: <span className="text-white font-medium">{exercise.programming.advanced.variation}</span></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Structured Progressions */}
          {exercise.progressionSteps && exercise.progressionSteps.length > 0 && (
            <div className="glass-card p-6 border-t-2 border-t-accent-500">
              <h3 className="text-sm font-bold text-accent-400 uppercase tracking-wider mb-4">Progression Path</h3>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
                {exercise.progressionSteps.map((step) => (
                  <div key={step.level} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-accent-500 bg-surface text-accent-400 text-xs font-bold z-10 shrink-0 shadow-[0_0_10px_rgba(var(--color-accent-500),0.3)]">
                      {step.level}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] ml-3 p-3 rounded-lg bg-surface border border-surface-border text-sm font-medium text-slate-300">
                      {step.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
};

export default ExerciseDetailsPage;
