/**
 * @page DashboardPage
 * @description Main dashboard landing page.
 * Currently displaying profile completion metrics and basic user data.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiLightningBolt, HiUser, HiFire, HiCalendar, HiDatabase } from 'react-icons/hi';
import { format } from 'date-fns';

import useAuth from '../../hooks/useAuth.js';
import { fetchProfile, selectProfile, selectProfileLoading } from '../../store/slices/profileSlice.js';
import { fetchWorkoutPlans, fetchWorkoutHistory, fetchStatsAndPRs } from '../../store/slices/workoutSlice.js';
import { logoutUser } from '../../store/slices/authSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isProfileLoading = useSelector(selectProfileLoading);
  const { plans, history, stats, prs, isLoading: isWorkoutLoading } = useSelector(state => state.workout);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchWorkoutPlans({ limit: 1 }));
    dispatch(fetchWorkoutHistory({ limit: 1 }));
    dispatch(fetchStatsAndPRs());
  }, [dispatch]);

  if (isProfileLoading || isWorkoutLoading || !profile || !stats) return <FullScreenLoader />;

  const nextWorkout = plans && plans.length > 0 ? plans[0] : null;
  const latestPR = prs && prs.length > 0 ? prs[0] : null;

  const formatVolume = (vol) => {
    if (!vol) return '0 kg';
    if (vol >= 1000) {
      return (vol / 1000).toFixed(1).replace(/\.0$/, '') + 'k kg';
    }
    return vol.toLocaleString() + ' kg';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ─── WELCOME HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-6 border-l-4 border-l-brand-500">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-border overflow-hidden border-2 border-surface-border">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-2xl font-bold bg-brand-500/10">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Welcome back, {profile.name}!</h1>
            <p className="text-slate-400">Ready to crush your goals today?</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link to="/profile" className="btn-secondary h-10 px-4 inline-flex items-center gap-2">
            <HiUser className="w-4 h-4" /> My Profile
          </Link>
          <button onClick={() => dispatch(logoutUser())} className="btn-secondary bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20 h-10 px-4">
            Sign out
          </button>
        </div>
      </div>

      {/* ─── METRICS GRID ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 hover:border-brand-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
              <HiCalendar className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Sessions</p>
          </div>
          <p className="text-3xl font-display font-bold text-white">{stats.totalSessions}</p>
        </div>
        
        <div className="glass-card p-5 hover:border-orange-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <HiFire className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Streak</p>
          </div>
          <p className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
            {stats.streak} <span className="text-sm font-normal text-slate-500 tracking-wide">DAYS</span>
          </p>
        </div>
        
        <div className="glass-card p-5 hover:border-accent-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 group-hover:scale-110 transition-transform">
              <HiDatabase className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Volume</p>
          </div>
          <p className="text-3xl font-display font-bold text-white">{formatVolume(stats.totalVolume)}</p>
        </div>
        
        <div className="glass-card p-5 hover:border-brand-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-surface-border flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <HiLightningBolt className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Weekly Goal</p>
          </div>
          <p className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
            {profile.trainingDaysPerWeek || 0} <span className="text-sm font-normal text-slate-500 tracking-wide">DAYS/WK</span>
          </p>
        </div>
      </div>

      {(nextWorkout || latestPR) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Next Workout */}
          {nextWorkout && (
            <div className="glass-card p-6 border-t-2 border-t-brand-500">
              <h2 className="text-lg font-bold text-white mb-4">Up Next</h2>
              <div className="bg-surface border border-surface-border p-5 rounded-xl hover:border-brand-500/50 transition-colors">
                <h3 className="font-bold text-white text-lg">{nextWorkout.name}</h3>
                <p className="text-sm text-brand-400 mb-4">{nextWorkout.days?.[0]?.title || 'Workout Ready'}</p>
                <Link to={`/workouts/plans/${nextWorkout._id}`} className="btn-primary w-full inline-flex justify-center items-center gap-2">
                  Start Session <HiArrowRight />
                </Link>
              </div>
            </div>
          )}

          {/* Recent PR */}
          {latestPR && (
            <div className="glass-card p-6 border-t-2 border-t-orange-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Recent PR</h2>
                <Link to="/workouts/history" className="text-sm text-brand-400 hover:text-brand-300 font-medium">View All</Link>
              </div>
              <div className="bg-surface border border-orange-500/30 p-5 rounded-xl flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 shadow-inner">
                  <HiFire className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{latestPR.exercise?.name}</p>
                  <p className="text-2xl font-display font-bold text-brand-400 mt-0.5">
                    {latestPR.recordType === 'weight' ? `${latestPR.value} kg` : `${latestPR.value} Reps`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
