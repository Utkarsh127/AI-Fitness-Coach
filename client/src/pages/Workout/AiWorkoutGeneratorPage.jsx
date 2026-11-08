import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2, Save, RefreshCw } from 'lucide-react';
import { generateAiWorkoutPlan, clearGeneratedWorkout } from '../../store/slices/aiCoachSlice.js';
import * as workoutApi from '../../api/workout.api.js';
import toast from 'react-hot-toast';

const AiWorkoutGeneratorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { generatedWorkout, isGeneratingWorkout } = useSelector(state => state.aiCoach);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    goal: user?.fitnessProfile?.fitnessGoals?.[0] || 'Strength',
    daysPerWeek: user?.fitnessProfile?.trainingDaysPerWeek || 3,
    difficulty: user?.fitnessProfile?.experienceLevel || 'Intermediate',
    equipment: user?.fitnessProfile?.equipmentAvailable || [],
    focus: [],
    sessionDuration: 60,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    dispatch(generateAiWorkoutPlan({
      ...formData,
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionDuration: parseInt(formData.sessionDuration)
    }));
  };

  const handleSave = async () => {
    if (!generatedWorkout) return;
    try {
      setIsSaving(true);
      await workoutApi.createWorkoutPlan(generatedWorkout);
      toast.success('Workout Plan Saved!');
      dispatch(clearGeneratedWorkout());
      navigate('/workouts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save workout plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate('/workouts')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Workouts
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-blue-200" />
            <h1 className="text-3xl font-bold tracking-tight">AI Workout Generator</h1>
          </div>
          <p className="text-blue-100 max-w-2xl text-lg">
            Let our AI analyze your fitness profile and build a completely personalized workout plan tailored to your goals and equipment.
          </p>
        </div>

        {!generatedWorkout ? (
          <div className="p-6 md:p-8">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
                  <input
                    type="text"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days Per Week</label>
                  <input
                    type="number"
                    name="daysPerWeek"
                    min="1"
                    max="7"
                    value={formData.daysPerWeek}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration (mins)</label>
                  <input
                    type="number"
                    name="sessionDuration"
                    min="10"
                    max="180"
                    value={formData.sessionDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isGeneratingWorkout}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isGeneratingWorkout ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{generatedWorkout.name}</h2>
                <p className="text-gray-600 mt-1">{generatedWorkout.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGeneratingWorkout}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors flex items-center"
                >
                  {isGeneratingWorkout ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Regenerate
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg transition-colors shadow-sm flex items-center"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save to My Plans
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Goal</p>
                <p className="font-semibold text-gray-900 capitalize">{generatedWorkout.goal}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Difficulty</p>
                <p className="font-semibold text-gray-900">{generatedWorkout.difficulty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Duration</p>
                <p className="font-semibold text-gray-900">{generatedWorkout.durationWeeks} Weeks</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Schedule</p>
                <p className="font-semibold text-gray-900">{generatedWorkout.daysPerWeek} Days/Wk</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Workout Days</h3>
              {generatedWorkout.days.map((day, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Day {day.dayNumber}: {day.title}</h4>
                      {day.focus && <p className="text-sm text-gray-500">{day.focus}</p>}
                    </div>
                    {day.isRestDay && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Rest Day</span>
                    )}
                  </div>
                  
                  {!day.isRestDay && day.exercises?.length > 0 && (
                    <div className="px-6 py-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead>
                            <tr className="text-gray-500 border-b border-gray-100">
                              <th className="pb-3 font-medium">Exercise</th>
                              <th className="pb-3 font-medium">Sets</th>
                              <th className="pb-3 font-medium">Reps</th>
                              <th className="pb-3 font-medium">Rest</th>
                              <th className="pb-3 font-medium">Weight/Intensity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {day.exercises.map((ex, eIdx) => (
                              <tr key={eIdx} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 font-medium text-gray-900">
                                  {ex.exerciseName || 'Unknown Exercise'}
                                </td>
                                <td className="py-3 text-gray-600">{ex.sets}</td>
                                <td className="py-3 text-gray-600">{ex.reps}</td>
                                <td className="py-3 text-gray-600">{ex.restTime}s</td>
                                <td className="py-3 text-gray-600">
                                  {ex.weight || '-'} {ex.intensity ? `(${ex.intensity})` : ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiWorkoutGeneratorPage;
