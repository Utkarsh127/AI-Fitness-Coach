/**
 * @page OnboardingFlow
 * @description Multi-step form for initial fitness profile setup.
 * Uses react-hook-form, framer-motion for step transitions, and Tailwind for UI.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck, HiChevronRight, HiChevronLeft } from 'react-icons/hi';

import { submitOnboarding } from '../../store/slices/profileSlice.js';
import { checkAuth } from '../../store/slices/authSlice.js';
import { onboardingSchema } from '../../utils/validators.js';
import { Spinner } from '../../components/common/Loader.jsx';

const STEPS = [
  { id: 'about', title: 'About You' },
  { id: 'body', title: 'Body' },
  { id: 'goals', title: 'Goals' },
  { id: 'experience', title: 'Experience' },
  { id: 'training', title: 'Training' },
  { id: 'skills', title: 'Skills' },
];

const FITNESS_GOALS = ['Strength', 'Muscle Gain', 'Fat Loss', 'Endurance', 'Calisthenics', 'Hybrid Training', 'Aesthetic', 'General Fitness'];
const EQUIPMENT_LIST = ['No Equipment', 'Pull-up Bar', 'Dip Bars', 'Resistance Bands', 'Dumbbells', 'Barbell', 'Bench', 'Kettlebell', 'Rings', 'Parallettes', 'Cable Machine', 'Other'];
const SKILLS_LIST = [
  { key: 'pushUps', label: 'Push-ups' },
  { key: 'pullUps', label: 'Pull-ups' },
  { key: 'dips', label: 'Dips' },
  { key: 'handstandPushUps', label: 'Handstand Push-ups' },
  { key: 'muscleUps', label: 'Muscle-ups' },
  { key: 'lSit', label: 'L-Sit' },
  { key: 'pistolSquat', label: 'Pistol Squat' },
  { key: 'plank', label: 'Plank' },
  { key: 'frontLever', label: 'Front Lever' },
  { key: 'planche', label: 'Planche' },
];
const SKILL_LEVELS = [
  { value: 'notStarted', label: 'Not Started' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'achieved', label: 'Achieved' },
];

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fitnessGoal: [],
      availableEquipment: [],
      calisthenicsSkills: {},
    },
    mode: 'onTouched',
  });

  const handleNext = async () => {
    // Determine fields to validate based on current step
    let fieldsToValidate = [];
    switch (currentStep) {
      case 0: fieldsToValidate = ['age', 'gender']; break;
      case 1: fieldsToValidate = ['height', 'weight', 'bodyFatPercentage']; break;
      case 2: fieldsToValidate = ['fitnessGoal']; break;
      case 3: fieldsToValidate = ['experienceLevel']; break;
      case 4: fieldsToValidate = ['trainingDaysPerWeek', 'preferredWorkoutDuration', 'trainingLocation', 'availableEquipment']; break;
      case 5: fieldsToValidate = ['calisthenicsSkills']; break;
      default: break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Remove empty bodyFatPercentage so it doesn't fail backend strict validation if not provided
    if (data.bodyFatPercentage === '') delete data.bodyFatPercentage;
    
    const result = await dispatch(submitOnboarding(data));
    if (submitOnboarding.fulfilled.match(result)) {
      // Rehydrate auth state so app knows onboarding is completed
      await dispatch(checkAuth());
      navigate('/dashboard', { replace: true });
    }
    setIsSubmitting(false);
  };

  const currentGoalValues = watch('fitnessGoal');
  const currentEquipValues = watch('availableEquipment');

  // Multi-select helper
  const toggleArrayItem = (fieldValue, item, onChange) => {
    const current = fieldValue || [];
    if (current.includes(item)) {
      onChange(current.filter((i) => i !== item));
    } else {
      onChange([...current, item]);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-white">Setup Profile</h1>
            <span className="text-sm font-medium text-brand-400">Step {currentStep + 1} of {STEPS.length}</span>
          </div>
          
          <div className="flex gap-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors duration-300 ${
                  idx <= currentStep ? 'bg-brand-500' : 'bg-surface-border'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-10 overflow-hidden relative min-h-[400px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* ─── STEP 1: ABOUT ───────────────────────────── */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">Let's start with the basics</h2>
                    
                    <div>
                      <label className="label">Age</label>
                      <input type="number" placeholder="e.g. 25" className={`input ${errors.age ? 'border-red-500' : ''}`} {...register('age')} />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
                    </div>

                    <div>
                      <label className="label">Gender</label>
                      <select className={`input ${errors.gender ? 'border-red-500' : ''}`} {...register('gender')}>
                        <option value="">Select gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                      {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                    </div>
                  </div>
                )}

                {/* ─── STEP 2: BODY ────────────────────────────── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">Body Metrics (Metric)</h2>
                    
                    <div>
                      <label className="label">Height (cm)</label>
                      <input type="number" placeholder="e.g. 175" className={`input ${errors.height ? 'border-red-500' : ''}`} {...register('height')} />
                      {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height.message}</p>}
                    </div>

                    <div>
                      <label className="label">Weight (kg)</label>
                      <input type="number" step="0.1" placeholder="e.g. 70.5" className={`input ${errors.weight ? 'border-red-500' : ''}`} {...register('weight')} />
                      {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight.message}</p>}
                    </div>

                    <div>
                      <label className="label">Body Fat % (Optional)</label>
                      <input type="number" step="0.1" placeholder="e.g. 15" className={`input ${errors.bodyFatPercentage ? 'border-red-500' : ''}`} {...register('bodyFatPercentage')} />
                      {errors.bodyFatPercentage && <p className="text-red-400 text-xs mt-1">{errors.bodyFatPercentage.message}</p>}
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: GOALS ───────────────────────────── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">What are your primary goals?</h2>
                    <p className="text-sm text-slate-400 mb-4">Select all that apply.</p>
                    
                    <Controller
                      name="fitnessGoal"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-3">
                          {FITNESS_GOALS.map(goal => {
                            const isSelected = field.value?.includes(goal);
                            return (
                              <div
                                key={goal}
                                onClick={() => toggleArrayItem(field.value, goal, field.onChange)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-brand-500 bg-brand-500/10' 
                                    : 'border-surface-border bg-surface hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{goal}</span>
                                  {isSelected && <HiCheck className="text-brand-500 w-5 h-5" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.fitnessGoal && <p className="text-red-400 text-xs mt-1">{errors.fitnessGoal.message}</p>}
                  </div>
                )}

                {/* ─── STEP 4: EXPERIENCE ──────────────────────── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">What is your current fitness level?</h2>
                    
                    <Controller
                      name="experienceLevel"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                            const isSelected = field.value === level;
                            return (
                              <div
                                key={level}
                                onClick={() => field.onChange(level)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-brand-500 bg-brand-500/10' 
                                    : 'border-surface-border bg-surface hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{level}</span>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-500' : 'border-slate-600'}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.experienceLevel && <p className="text-red-400 text-xs mt-1">{errors.experienceLevel.message}</p>}
                  </div>
                )}

                {/* ─── STEP 5: TRAINING ────────────────────────── */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">Training Preferences</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Days per week</label>
                        <input type="number" placeholder="e.g. 4" className={`input ${errors.trainingDaysPerWeek ? 'border-red-500' : ''}`} {...register('trainingDaysPerWeek')} />
                        {errors.trainingDaysPerWeek && <p className="text-red-400 text-xs mt-1">{errors.trainingDaysPerWeek.message}</p>}
                      </div>
                      <div>
                        <label className="label">Minutes per session</label>
                        <input type="number" placeholder="e.g. 60" className={`input ${errors.preferredWorkoutDuration ? 'border-red-500' : ''}`} {...register('preferredWorkoutDuration')} />
                        {errors.preferredWorkoutDuration && <p className="text-red-400 text-xs mt-1">{errors.preferredWorkoutDuration.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="label">Where do you train?</label>
                      <select className={`input ${errors.trainingLocation ? 'border-red-500' : ''}`} {...register('trainingLocation')}>
                        <option value="">Select location...</option>
                        <option value="Home">Home</option>
                        <option value="Gym">Gym</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Both">Home & Gym</option>
                      </select>
                      {errors.trainingLocation && <p className="text-red-400 text-xs mt-1">{errors.trainingLocation.message}</p>}
                    </div>

                    <div>
                      <label className="label mb-3">Available Equipment</label>
                      <Controller
                        name="availableEquipment"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-wrap gap-2">
                            {EQUIPMENT_LIST.map(eq => {
                              const isSelected = field.value?.includes(eq);
                              return (
                                <button
                                  key={eq}
                                  type="button"
                                  onClick={() => toggleArrayItem(field.value, eq, field.onChange)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isSelected ? 'bg-brand-500 text-white' : 'bg-surface-border text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {eq}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 6: SKILLS ──────────────────────────── */}
                {currentStep === 5 && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <h2 className="text-xl font-bold text-white mb-2">Calisthenics Skills</h2>
                    <p className="text-sm text-slate-400 mb-6">Rate your current ability in these movements. Leave as "Not Started" if you're unsure or don't train them.</p>
                    
                    <div className="space-y-4">
                      {SKILLS_LIST.map(skill => (
                        <div key={skill.key} className="p-4 rounded-xl bg-surface-border/50">
                          <label className="block text-white font-medium mb-2">{skill.label}</label>
                          <select className="input bg-surface border-slate-700" {...register(`calisthenicsSkills.${skill.key}`)}>
                            {SKILL_LEVELS.map(lvl => (
                              <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    {errors.root && <p className="text-red-400 text-sm mt-4">{errors.root.message}</p>}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-surface-border">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary h-11 px-6 inline-flex items-center gap-2"
                >
                  <HiChevronLeft className="w-5 h-5" /> Back
                </button>
              ) : (
                <div /> // Spacer
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary h-11 px-6 inline-flex items-center gap-2"
                >
                  Next <HiChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary h-11 px-8 inline-flex items-center gap-2"
                >
                  {isSubmitting ? <Spinner size="sm" /> : 'Complete Profile'}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default OnboardingFlow;
