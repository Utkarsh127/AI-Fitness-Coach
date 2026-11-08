/**
 * @page ActiveWorkoutPage
 * @description The in-gym workout experience. Mobile-optimized.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiX, HiCheck, HiPlay, HiPause, HiRefresh, HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import { fetchWorkoutPlanDetails, logWorkoutSession } from '../../store/slices/workoutSlice.js';
import { FullScreenLoader, Spinner } from '../../components/common/Loader.jsx';

const RestTimer = ({ defaultTime, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Optional: Could trigger audio beep here based on user preference
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const addTime = () => setTimeLeft(t => t + 30);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-border p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-brand-500 flex items-center justify-center relative">
            <span className="font-display font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
          <div>
            <p className="font-bold text-white">Resting</p>
            <p className="text-sm text-slate-400">Next set coming up</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={addTime} className="btn-secondary h-10 w-10 p-0 text-xs font-bold">+30s</button>
          <button onClick={toggle} className="btn-secondary h-10 w-10 p-0 flex items-center justify-center">
            {isActive ? <HiPause /> : <HiPlay />}
          </button>
          <button onClick={onSkip} className="btn-primary h-10 px-4">Skip</button>
        </div>
      </div>
    </div>
  );
};

const ActiveWorkoutPage = () => {
  const { planId, dayId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPlan, isLoading } = useSelector(state => state.workout);
  
  // Local state for the session
  const [startTime] = useState(Date.now());
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [loggedSets, setLoggedSets] = useState({}); // { [exId]: [ { reps, weight }, ... ] }
  
  // Input states for current set
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  
  // Rest Timer state
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);

  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (planId) {
      dispatch(fetchWorkoutPlanDetails(planId));
    }
  }, [dispatch, planId]);

  if (isLoading || !currentPlan) return <FullScreenLoader />;

  const dayData = currentPlan.days.find(d => d._id === dayId);
  if (!dayData) return <div className="p-8 text-center text-white">Day not found</div>;

  const exercises = dayData.exercises;
  const currentEx = exercises[currentExIndex];
  
  // Initialize set tracker if empty
  if (!loggedSets[currentEx._id]) {
    setLoggedSets(prev => ({ ...prev, [currentEx._id]: [] }));
  }
  const completedSetsCount = loggedSets[currentEx._id]?.length || 0;
  const isExComplete = completedSetsCount >= currentEx.sets;

  const handleCompleteSet = () => {
    if (!currentReps) return;

    const newSet = { reps: currentReps, weight: currentWeight || 0 };
    setLoggedSets(prev => ({
      ...prev,
      [currentEx._id]: [...(prev[currentEx._id] || []), newSet]
    }));

    // If not the very last set of the workout, trigger rest timer
    const isVeryLastSet = (currentExIndex === exercises.length - 1) && (completedSetsCount + 1 >= currentEx.sets);
    
    if (!isVeryLastSet) {
      setRestTime(currentEx.restTime || 90);
      setIsResting(true);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    // Move to next exercise automatically if current is done
    if (completedSetsCount >= currentEx.sets && currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentReps('');
      setCurrentWeight('');
    }
  };

  const finishWorkout = async () => {
    setIsFinishing(true);
    const duration = Math.floor((Date.now() - startTime) / 60000); // minutes
    
    // Format payload
    const formattedExercises = exercises.map(ex => {
      const sets = loggedSets[ex._id] || [];
      // Calculate total weight (volume) for this exercise
      const vol = sets.reduce((acc, s) => acc + (parseFloat(s.weight) || 0) * parseInt(s.reps, 10), 0);
      return {
        exerciseId: ex.exerciseId._id,
        sets: sets.length,
        reps: sets.map(s => s.reps).join(','), // Simple string representation for logs
        weight: Math.max(...sets.map(s => parseFloat(s.weight) || 0), 0), // Max weight
        volume: vol
      };
    }).filter(e => e.sets > 0);

    const totalVolume = formattedExercises.reduce((acc, ex) => acc + (ex.volume || 0), 0);

    const payload = {
      workoutPlan: planId,
      workoutDay: dayId,
      duration: duration || 1, // min 1
      exercises: formattedExercises,
      totalVolume,
      completed: true
    };

    await dispatch(logWorkoutSession(payload));
    navigate('/workouts/history', { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-surface z-50 flex flex-col md:pb-0">
      
      {/* Header */}
      <div className="h-16 border-b border-surface-border flex items-center justify-between px-4 shrink-0 bg-surface/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white">
          <HiX className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-white truncate max-w-[200px]">{dayData.title}</h1>
        <button onClick={finishWorkout} disabled={isFinishing} className="text-brand-400 font-bold px-2 py-1">
          {isFinishing ? <Spinner size="sm" /> : 'Finish'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:max-w-3xl lg:mx-auto lg:w-full pb-32">
        
        {/* Progress Bar */}
        <div className="flex gap-1 mb-8">
          {exercises.map((ex, idx) => {
            const isDone = (loggedSets[ex._id]?.length || 0) >= ex.sets;
            const isCurrent = idx === currentExIndex;
            return (
              <div key={ex._id} className="h-1.5 flex-1 rounded-full bg-surface-border overflow-hidden">
                <div className={`h-full transition-all ${isDone ? 'bg-brand-500' : isCurrent ? 'bg-accent-500 w-1/2' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* Current Exercise Info */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-3xl font-display font-bold text-white">{currentEx.exerciseId?.name}</h2>
            <div className="text-right shrink-0">
              <span className="badge bg-surface-border text-slate-300">
                {currentExIndex + 1} / {exercises.length}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-surface-border/50 px-3 py-2 rounded-lg text-sm">
              <span className="text-slate-400 block mb-0.5">Target Sets</span>
              <span className="text-white font-bold">{currentEx.sets}</span>
            </div>
            <div className="bg-surface-border/50 px-3 py-2 rounded-lg text-sm">
              <span className="text-slate-400 block mb-0.5">Target Reps</span>
              <span className="text-white font-bold">{currentEx.reps}</span>
            </div>
            {currentEx.weight && (
              <div className="bg-surface-border/50 px-3 py-2 rounded-lg text-sm">
                <span className="text-slate-400 block mb-0.5">Target Weight</span>
                <span className="text-white font-bold">{currentEx.weight}</span>
              </div>
            )}
          </div>
        </div>

        {/* Previous Sets History */}
        {completedSetsCount > 0 && (
          <div className="mb-8 space-y-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Completed Sets</h3>
            {loggedSets[currentEx._id].map((set, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border/50 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <span className="text-white font-medium">{set.weight ? `${set.weight} kg × ` : ''}{set.reps} reps</span>
                </div>
                <HiCheck className="text-brand-500 w-5 h-5" />
              </div>
            ))}
          </div>
        )}

        {/* Input Form for Current Set */}
        {!isExComplete ? (
          <div className="glass-card p-5 border-l-4 border-l-accent-500">
            <h3 className="font-bold text-white mb-4">Log Set {completedSetsCount + 1}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label text-slate-300">Weight (kg)</label>
                <input 
                  type="number" 
                  className="input bg-surface text-lg text-center font-bold" 
                  placeholder="0" 
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                />
              </div>
              <div>
                <label className="label text-slate-300">Reps</label>
                <input 
                  type="number" 
                  className="input bg-surface text-lg text-center font-bold" 
                  placeholder={currentEx.reps.replace(/[^0-9]/g, '') || '0'} 
                  value={currentReps}
                  onChange={e => setCurrentReps(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={handleCompleteSet}
              disabled={!currentReps}
              className="btn-primary w-full py-4 text-lg"
            >
              Complete Set
            </button>
          </div>
        ) : (
          <div className="glass-card p-6 text-center border border-brand-500/50">
            <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-500 mx-auto flex items-center justify-center mb-4">
              <HiCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exercise Complete!</h3>
            
            {currentExIndex < exercises.length - 1 ? (
              <button 
                onClick={() => {
                  setCurrentExIndex(prev => prev + 1);
                  setCurrentReps('');
                  setCurrentWeight('');
                }}
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                Next Exercise <HiChevronRight />
              </button>
            ) : (
              <button onClick={finishWorkout} className="btn-primary mt-4 w-full">
                Finish Workout
              </button>
            )}
          </div>
        )}

        {/* Exercise Navigation Controls */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-surface-border">
          <button 
            onClick={() => setCurrentExIndex(prev => prev - 1)}
            disabled={currentExIndex === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 font-medium"
          >
            <HiChevronLeft className="w-5 h-5" /> Prev Exercise
          </button>
          <button 
            onClick={() => setCurrentExIndex(prev => prev + 1)}
            disabled={currentExIndex === exercises.length - 1}
            className="text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 font-medium"
          >
            Skip <HiChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Rest Timer Overlay */}
      {isResting && <RestTimer defaultTime={restTime} onSkip={handleSkipRest} />}

    </div>
  );
};

export default ActiveWorkoutPage;
