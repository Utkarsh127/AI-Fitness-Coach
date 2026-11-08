/**
 * @page WorkoutPlansPage
 * @description List of user's workout plans.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiPlus, HiClock, HiCalendar, HiLightningBolt } from 'react-icons/hi';
import { Sparkles, History } from 'lucide-react';
import { fetchWorkoutPlans } from '../../store/slices/workoutSlice.js';
import { FullScreenLoader } from '../../components/common/Loader.jsx';

const WorkoutPlansPage = () => {
  const dispatch = useDispatch();
  const { plans, isLoading } = useSelector(state => state.workout);

  useEffect(() => {
    dispatch(fetchWorkoutPlans({ limit: 20 }));
  }, [dispatch]);

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Plans</h1>
          <p className="mt-2 text-gray-600">Choose a plan or let AI generate a personalized one for you.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/workouts/ai-generator"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generator
          </Link>
          <Link 
            to="/workouts/history"
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Link>
        </div>
      </div> 

      {plans.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface-border flex items-center justify-center mb-4">
            <HiLightningBolt className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No plans found</h2>
          <p className="text-slate-400 mb-6">Create your first custom workout plan or let AI generate one for you.</p>
          <Link to="/workouts/ai-generator" className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate AI Plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Link to={`/workouts/plans/${plan._id}`} key={plan._id} className="glass-card p-6 group hover:border-brand-500/50 transition-colors flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`badge ${
                  plan.difficulty === 'Beginner' ? 'badge-green' : 
                  plan.difficulty === 'Intermediate' ? 'badge-blue' : 
                  'badge-red'
                }`}>
                  {plan.difficulty}
                </span>
                {plan.isPublic && <span className="badge bg-surface-border text-slate-300">Public</span>}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">{plan.description || plan.goal}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-border">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <HiCalendar className="text-brand-400" />
                  {plan.durationWeeks} Weeks
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <HiClock className="text-brand-400" />
                  {plan.daysPerWeek} Days/wk
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlansPage;
