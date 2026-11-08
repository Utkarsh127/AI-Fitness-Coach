/**
 * @page WorkoutHistoryPage
 * @description List of completed workouts, stats, and PRs.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiFire, HiClock, HiDatabase, HiChartBar } from 'react-icons/hi';
import { fetchWorkoutHistory, fetchStatsAndPRs } from '../../store/slices/workoutSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';
import { format } from 'date-fns';

const WorkoutHistoryPage = () => {
  const dispatch = useDispatch();
  const { history, stats, prs, isLoading } = useSelector(state => state.workout);

  useEffect(() => {
    dispatch(fetchWorkoutHistory({ limit: 20 }));
    dispatch(fetchStatsAndPRs());
  }, [dispatch]);

  if (isLoading || !stats) return <FullScreenLoader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">History & Stats</h1>
        <p className="text-slate-400">Track your progress and celebrate your wins.</p>
      </div>

      {/* ─── STATS GRID ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-t-2 border-t-brand-500">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <HiDatabase className="w-4 h-4" /> Sessions
          </div>
          <p className="text-2xl font-display font-bold text-white">{stats.totalSessions}</p>
        </div>
        
        <div className="glass-card p-5 border-t-2 border-t-orange-500">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <HiFire className="w-4 h-4" /> Streak
          </div>
          <p className="text-2xl font-display font-bold text-white">{stats.streak} <span className="text-sm font-normal text-slate-500">days</span></p>
        </div>

        <div className="glass-card p-5 border-t-2 border-t-accent-500">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <HiChartBar className="w-4 h-4" /> Volume
          </div>
          <p className="text-2xl font-display font-bold text-white">{(stats.totalVolume / 1000).toFixed(1)}<span className="text-sm font-normal text-slate-500">k kg</span></p>
        </div>

        <div className="glass-card p-5 border-t-2 border-t-blue-500">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <HiClock className="w-4 h-4" /> Time
          </div>
          <p className="text-2xl font-display font-bold text-white">{(stats.totalDuration / 60).toFixed(1)}<span className="text-sm font-normal text-slate-500">h</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ─── RECENT HISTORY ────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Recent Workouts</h2>
          
          {history.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400">
              No workouts logged yet. Time to hit the gym!
            </div>
          ) : (
            history.map(log => (
              <div key={log._id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">
                    {log.workoutPlan?.name || 'Custom Workout'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{format(new Date(log.date), 'MMM d, yyyy - h:mm a')}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-border" />
                    <span>{log.duration} min</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-slate-500 mb-1">Exercises</p>
                    <p className="font-bold text-white">{log.exercises?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 mb-1">Volume</p>
                    <p className="font-bold text-white">{log.totalVolume || 0}kg</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── PERSONAL RECORDS ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Personal Records 🏆
          </h2>
          
          {prs.length === 0 ? (
            <div className="glass-card p-6 text-center text-slate-400 text-sm">
              Keep pushing to unlock your first Personal Record!
            </div>
          ) : (
            <div className="space-y-3">
              {prs.map(pr => (
                <div key={pr._id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <HiFire className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{pr.exercise?.name}</p>
                    <p className="text-xs text-slate-400">{format(new Date(pr.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-brand-400 text-lg">
                      {pr.recordType === 'weight' ? `${pr.value}kg` : `${pr.value} Reps`}
                    </p>
                    {pr.recordType === 'weight' && pr.reps > 0 && (
                      <p className="text-xs text-slate-500">for {pr.reps} reps</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
