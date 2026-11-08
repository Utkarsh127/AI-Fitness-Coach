/**
 * @page WorkoutPlanDetailsPage
 * @description View details of a specific workout plan, showing the weekly structure.
 */

import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowLeft, HiPlay, HiClock, HiLightningBolt } from 'react-icons/hi';
import { fetchWorkoutPlanDetails } from '../../store/slices/workoutSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

const WorkoutPlanDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPlan: plan, isLoading } = useSelector(state => state.workout);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutPlanDetails(id));
    }
  }, [dispatch, id]);

  if (isLoading || !plan) return <FullScreenLoader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-brand-400 flex items-center gap-2 font-medium transition-colors">
        <HiArrowLeft /> Back to Plans
      </button>

      {/* Hero Section */}
      <div className="glass-card p-6 md:p-10 bg-gradient-to-br from-surface to-surface-border/30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="badge badge-blue">{plan.difficulty}</span>
              <span className="badge bg-surface-border text-slate-300">{plan.goal}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">{plan.name}</h1>
            <p className="text-slate-300 max-w-2xl">{plan.description}</p>
          </div>
          
          <div className="flex flex-col gap-4 min-w-[200px]">
            <div className="bg-surface p-4 rounded-xl border border-surface-border">
              <p className="text-sm text-slate-400 mb-1">Duration</p>
              <p className="text-xl font-bold text-white">{plan.durationWeeks} Weeks</p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-surface-border">
              <p className="text-sm text-slate-400 mb-1">Frequency</p>
              <p className="text-xl font-bold text-white">{plan.daysPerWeek} Days / week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Days Breakdown */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Weekly Structure</h2>
        <div className="space-y-6">
          {plan.days.map((day) => (
            <div key={day._id} className="glass-card overflow-hidden">
              <div className="p-5 bg-surface-border/30 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white">Day {day.dayNumber}: {day.title}</h3>
                  {day.focus && <p className="text-sm text-brand-400 font-medium mt-1">{day.focus}</p>}
                </div>
                {!day.isRestDay && day.exercises?.length > 0 && (
                  <Link to={`/workouts/active/${plan._id}/${day._id}`} className="btn-primary h-10 px-6 inline-flex items-center gap-2 shrink-0">
                    <HiPlay className="w-5 h-5" /> Start Session
                  </Link>
                )}
              </div>
              
              <div className="p-5">
                {day.isRestDay ? (
                  <div className="py-8 text-center text-slate-400 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-surface-border flex items-center justify-center mb-3">
                      <span className="text-xl">😴</span>
                    </div>
                    <p className="font-medium">Active Rest Day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {day.exercises.map((ex, idx) => (
                      <div key={ex._id} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-surface-border hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight mb-1">{ex.exerciseId?.name || 'Unknown Exercise'}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <span className="text-slate-300 font-medium">{ex.sets} sets × {ex.reps}</span>
                              {ex.weight && <span className="text-slate-400">Target: {ex.weight}</span>}
                              {ex.intensity && <span className="text-orange-400">{ex.intensity}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-surface-border px-2 py-1 rounded">
                            <HiClock className="w-3 h-3" /> {ex.restTime}s rest
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WorkoutPlanDetailsPage;
