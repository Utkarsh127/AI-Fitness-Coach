import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Exercise from '../models/exercise.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const exercises = [
  // =========================================================
  // STRENGTH TRAINING - BEGINNER
  // =========================================================
  {
    name: 'Push-ups',
    slug: 'push-ups',
    description: 'The push-up is a fundamental horizontal pressing exercise performed with bodyweight. It primarily targets the pectorals, anterior deltoids, and triceps. It is highly useful for building foundational upper-body pressing strength and core stability. It is suitable for all levels, as it can be easily modified. Beginners should start with wall or incline push-ups before moving to the floor. With consistent training for around 6 weeks, many individuals may notice improved upper-body endurance, stronger pushing mechanics, and better core control.',
    detailedDescription: 'The push-up is a fundamental horizontal pressing exercise performed with bodyweight. It primarily targets the pectorals, anterior deltoids, and triceps. It is highly useful for building foundational upper-body pressing strength and core stability. It is suitable for all levels, as it can be easily modified. Beginners should start with wall or incline push-ups before moving to the floor. With consistent training for around 6 weeks, many individuals may notice improved upper-body endurance, stronger pushing mechanics, and better core control.',
    category: 'Strength Training',
    difficulty: 'Beginner',
    exerciseType: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoid', 'Rectus Abdominis'],
    equipment: ['No Equipment'],
    movementPattern: 'Horizontal Push',
    instructions: [
      'Start in a high plank position with your hands slightly wider than shoulder-width apart.',
      'Keep your core tight, glutes squeezed, and body in a straight line.',
      'Lower your body under control until your chest nearly touches the floor. Keep your elbows tucked at a 45-degree angle.',
      'Press powerfully back up to the starting position.'
    ],
    commonMistakes: [
      'Flaring elbows out to 90 degrees (places excessive stress on the shoulder joint).',
      'Sagging the hips or raising the hips too high.',
      'Performing half-reps instead of full range of motion.'
    ],
    benefits: [
      'Builds foundational upper body pushing strength.',
      'Improves core stability and anti-extension strength.',
      'Requires zero equipment and can be performed anywhere.'
    ],
    expectedImprovements: 'With consistent training for around 6 weeks, many individuals may notice improved upper-body endurance, stronger pushing mechanics, and better core control.',
    programming: {
      beginner: { sets: '3', reps: '6–10', rest: '60–90 sec', variation: 'Incline Push-ups or Knee Push-ups' },
      intermediate: { sets: '3-4', reps: '10–20', rest: '60–90 sec', variation: 'Standard Push-ups' },
      advanced: { sets: '4-5', reps: '15–30+', rest: '60–120 sec', variation: 'Weighted Push-ups or Deficit Push-ups' }
    },
    progressionSteps: [
      { level: 1, title: 'Wall Push-ups' },
      { level: 2, title: 'Incline Push-ups (on a bench)' },
      { level: 3, title: 'Knee Push-ups' },
      { level: 4, title: 'Standard Push-ups' },
      { level: 5, title: 'Decline / Weighted Push-ups' }
    ],
    imageUrl: '/images/exercises/push-ups.jpg',
  },
  {
    name: 'Bodyweight Squat',
    slug: 'bodyweight-squat',
    description: 'The bodyweight squat is the foundational movement pattern for lower body training. It heavily recruits the quadriceps, glutes, and hamstrings. It is essential for developing mobility, joint health, and basic leg strength. Everyone from absolute beginners to athletes should master this movement. Beginners can practice sitting back onto a box or chair to build confidence. After 6 weeks of consistent practice, users typically notice better hip mobility, more resilient knees, and improved lower body endurance.',
    detailedDescription: 'The bodyweight squat is the foundational movement pattern for lower body training. It heavily recruits the quadriceps, glutes, and hamstrings. It is essential for developing mobility, joint health, and basic leg strength. Everyone from absolute beginners to athletes should master this movement. Beginners can practice sitting back onto a box or chair to build confidence. After 6 weeks of consistent practice, users typically notice better hip mobility, more resilient knees, and improved lower body endurance.',
    category: 'Strength Training',
    difficulty: 'Beginner',
    exerciseType: 'Strength',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: ['No Equipment'],
    movementPattern: 'Squat',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointed slightly outward.',
      'Keep your chest proud and core engaged.',
      'Initiate the movement by pushing your hips back and bending your knees, as if sitting in a chair.',
      'Descend until your thighs are at least parallel to the floor.',
      'Push through your whole foot to return to the standing position, squeezing your glutes at the top.'
    ],
    commonMistakes: [
      'Letting the heels lift off the ground.',
      'Knees collapsing inward.',
      'Rounding the lower back at the bottom of the squat (butt wink).'
    ],
    benefits: [
      'Improves lower body mobility and joint health.',
      'Builds basic leg endurance and strength.',
      'Can be done anywhere as a warm-up or conditioning tool.'
    ],
    expectedImprovements: 'After 6 weeks of consistent practice, users typically notice better hip mobility, more resilient knees, and improved lower body endurance.',
    programming: {
      beginner: { sets: '3', reps: '10–15', rest: '60 sec', variation: 'Box Squat or Assisted Squat' },
      intermediate: { sets: '4', reps: '15–25', rest: '60 sec', variation: 'Standard Bodyweight Squat' },
      advanced: { sets: '4', reps: '20+ (Explosive)', rest: '90 sec', variation: 'Jump Squats' }
    },
    imageUrl: '/images/exercises/bodyweight-squat.jpg',
  },
  {
    name: 'Dead Bug',
    slug: 'dead-bug',
    description: 'The dead bug is a highly effective, low-impact core exercise. It targets the deep transverse abdominis and rectus abdominis while teaching the body to move the limbs independently of the spine. It is incredibly useful for improving core coordination and protecting the lower back. It is perfect for beginners and those recovering from back pain. Beginners should start by moving only their arms or only their legs. With 6 weeks of consistent training, users typically notice improved core bracing and a reduction in lower back discomfort during daily activities.',
    detailedDescription: 'The dead bug is a highly effective, low-impact core exercise. It targets the deep transverse abdominis and rectus abdominis while teaching the body to move the limbs independently of the spine. It is incredibly useful for improving core coordination and protecting the lower back. It is perfect for beginners and those recovering from back pain. Beginners should start by moving only their arms or only their legs. With 6 weeks of consistent training, users typically notice improved core bracing and a reduction in lower back discomfort during daily activities.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    exerciseType: 'Conditioning',
    muscleGroups: ['Core'],
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
    secondaryMuscles: ['Hip Flexors', 'Shoulders'],
    equipment: ['No Equipment'],
    movementPattern: 'Anti-extension',
    instructions: [
      'Lie flat on your back with your arms extended toward the ceiling and your knees bent at 90 degrees.',
      'Press your lower back firmly into the floor—there should be no space between your back and the mat.',
      'Slowly extend your right arm behind your head while simultaneously straightening your left leg toward the floor.',
      'Hover both limbs just above the ground without letting your lower back arch.',
      'Return to the starting position and repeat on the opposite side.'
    ],
    commonMistakes: [
      'Allowing the lower back to arch off the floor (losing core engagement).',
      'Moving too quickly instead of relying on slow, controlled tension.'
    ],
    benefits: [
      'Teaches proper core bracing and spinal neutrality.',
      'Safe and effective for rehabilitating lower back pain.',
      'Improves coordination and mind-muscle connection.'
    ],
    expectedImprovements: 'With 6 weeks of consistent training, users typically notice improved core bracing and a reduction in lower back discomfort during daily activities.',
    programming: {
      beginner: { sets: '3', reps: '10 total', rest: '60 sec', variation: 'Legs only Dead Bug' },
      intermediate: { sets: '3', reps: '20 total', rest: '60 sec', variation: 'Standard Dead Bug' },
      advanced: { sets: '4', reps: '30 total', rest: '60 sec', variation: 'Weighted Dead Bug (holding a small dumbbell)' }
    },
    imageUrl: '/images/exercises/dead-bug.jpg',
  },
  {
    name: 'Incline Push-up',
    slug: 'incline-push-up',
    description: 'The incline push-up is a fundamental upper-body pushing regression. Elevating the hands places less load on the chest, shoulders, and triceps, making it perfect for those building up to a full floor push-up. It is suitable for absolute beginners. To progress, users simply lower the height of the incline over time. After 6 weeks of consistent practice, many beginners will notice significant strength gains, allowing them to transition closer to standard push-ups.',
    detailedDescription: 'The incline push-up is a fundamental upper-body pushing regression. Elevating the hands places less load on the chest, shoulders, and triceps, making it perfect for those building up to a full floor push-up. It is suitable for absolute beginners. To progress, users simply lower the height of the incline over time. After 6 weeks of consistent practice, many beginners will notice significant strength gains, allowing them to transition closer to standard push-ups.',
    category: 'Strength Training',
    difficulty: 'Beginner',
    exerciseType: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoid', 'Core'],
    equipment: ['Bench'],
    movementPattern: 'Horizontal Push',
    instructions: [
      'Place your hands slightly wider than shoulder-width apart on a stable elevated surface (bench, box, or wall).',
      'Step your feet back so your body forms a straight line from head to heels.',
      'Lower your chest toward the surface by bending your elbows, keeping them tucked at a 45-degree angle.',
      'Press powerfully back up to the starting position.'
    ],
    commonMistakes: [
      'Flaring the elbows out completely to the sides.',
      'Sagging the hips or piking the buttocks into the air.'
    ],
    benefits: [
      'The safest and most effective way to build strength for a full push-up.',
      'Engages the core similarly to a standard push-up, unlike knee push-ups.'
    ],
    expectedImprovements: 'After 6 weeks of consistent practice, many beginners will notice significant strength gains, allowing them to transition closer to standard push-ups.',
    programming: {
      beginner: { sets: '3', reps: '5–10', rest: '60 sec', variation: 'High Incline (Wall or high table)' },
      intermediate: { sets: '3', reps: '10–15', rest: '60 sec', variation: 'Medium Incline (Bench or chair)' },
      advanced: { sets: '4', reps: '15+', rest: '60 sec', variation: 'Low Incline (Step or small box)' }
    },
    imageUrl: '/images/exercises/incline-push-up.jpg',
  },
  {
    name: 'Plank',
    slug: 'plank',
    description: 'The forearm plank is an essential isometric core exercise. It targets the rectus abdominis, transverse abdominis, and shoulders. It teaches the body to resist extension and maintain a rigid spine under gravity. It is suitable for all fitness levels. Beginners should start on their knees or a slight incline. With consistent training for 6 weeks, individuals generally notice better posture, improved core endurance, and a stronger foundation for heavier lifts.',
    detailedDescription: 'The forearm plank is an essential isometric core exercise. It targets the rectus abdominis, transverse abdominis, and shoulders. It teaches the body to resist extension and maintain a rigid spine under gravity. It is suitable for all fitness levels. Beginners should start on their knees or a slight incline. With consistent training for 6 weeks, individuals generally notice better posture, improved core endurance, and a stronger foundation for heavier lifts.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    exerciseType: 'Endurance',
    muscleGroups: ['Core', 'Shoulders'],
    primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: ['No Equipment'],
    movementPattern: 'Isometric',
    instructions: [
      'Rest on your forearms and toes, with elbows directly under your shoulders.',
      'Keep your body in a perfectly straight line from head to heels.',
      'Tuck your pelvis slightly (posterior pelvic tilt) and squeeze your glutes.',
      'Brace your core as if you are about to be punched in the stomach, and hold.'
    ],
    commonMistakes: [
      'Sagging the lower back, causing spinal compression and removing tension from the abs.',
      'Sticking the buttocks high up in the air.',
      'Forgetting to breathe.'
    ],
    benefits: [
      'Builds foundational core strength and stability.',
      'Protects the lower back from injury during heavy lifts.',
      'Improves posture.'
    ],
    expectedImprovements: 'With consistent training for 6 weeks, individuals generally notice better posture, improved core endurance, and a stronger foundation for heavier lifts.',
    programming: {
      beginner: { sets: '3', reps: '30–60 sec hold', rest: '60 sec', variation: 'Knee Plank' },
      intermediate: { sets: '3-4', reps: '60–120 sec hold', rest: '60 sec', variation: 'Standard Forearm Plank' },
      advanced: { sets: '4', reps: '60+ sec hold', rest: '60 sec', variation: 'Weighted Plank or Long-Lever Plank' }
    },
    imageUrl: '/images/exercises/plank.jpg',
  },

  // =========================================================
  // STRENGTH TRAINING - INTERMEDIATE
  // =========================================================
  {
    name: 'Pull-ups',
    slug: 'pull-ups',
    description: 'The pull-up is the gold standard vertical pulling exercise. It primarily develops the latissimus dorsi, rhomboids, and biceps. It is incredibly useful for building a wide back and testing upper-body strength-to-weight ratio. It is suited for intermediate trainees. Beginners should use resistance bands or focus on eccentric negatives to build up to their first rep. With 6 weeks of dedicated practice, individuals often see a noticeable widening of the lats and an increase in their maximum unbroken reps.',
    detailedDescription: 'The pull-up is the gold standard vertical pulling exercise. It primarily develops the latissimus dorsi, rhomboids, and biceps. It is incredibly useful for building a wide back and testing upper-body strength-to-weight ratio. It is suited for intermediate trainees. Beginners should use resistance bands or focus on eccentric negatives to build up to their first rep. With 6 weeks of dedicated practice, individuals often see a noticeable widening of the lats and an increase in their maximum unbroken reps.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Lats', 'Biceps', 'Upper Back'],
    primaryMuscles: ['Latissimus Dorsi', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Trapezius', 'Core'],
    equipment: ['Pull-up Bar'],
    movementPattern: 'Vertical Pull',
    instructions: [
      'Hang from a pull-up bar with an overhand grip, slightly wider than shoulder-width.',
      'Engage your core and depress your scapula (pull your shoulders down and back).',
      'Pull your body up until your chin clears the bar. Focus on pulling your elbows down to your hips.',
      'Lower yourself back down with control until your arms are fully extended (dead hang).'
    ],
    commonMistakes: [
      'Kipping or using momentum to swing over the bar.',
      'Not performing the full eccentric (lowering) phase.',
      'Reaching with the chin instead of pulling the chest to the bar.'
    ],
    benefits: [
      'Builds a wide, v-taper back.',
      'Incredible indicator of overall upper body strength-to-weight ratio.',
      'Develops strong grip and forearm endurance.'
    ],
    expectedImprovements: 'With 6 weeks of dedicated practice, individuals often see a noticeable widening of the lats and an increase in their maximum unbroken reps.',
    programming: {
      beginner: { sets: '3', reps: '4–8', rest: '90–120 sec', variation: 'Band-assisted Pull-ups or Negative Pull-ups' },
      intermediate: { sets: '3-4', reps: '8–12', rest: '90–120 sec', variation: 'Strict Pull-ups' },
      advanced: { sets: '4', reps: '5–8', rest: '120–180 sec', variation: 'Weighted Pull-ups' }
    },
    progressionSteps: [
      { level: 1, title: 'Active Hangs & Scapular Pulls' },
      { level: 2, title: 'Band-Assisted Pull-ups' },
      { level: 3, title: 'Pull-up Negatives' },
      { level: 4, title: 'Strict Pull-ups' },
      { level: 5, title: 'Weighted Pull-ups' }
    ],
    imageUrl: '/images/exercises/pull-ups.jpg',
  },
  {
    name: 'Chin-ups',
    slug: 'chin-ups',
    description: 'The chin-up is a vertical pulling variation using an underhand grip. This grip places the biceps in a highly advantageous position, heavily targeting the lats and biceps. It is slightly easier than a pull-up, making it a great intermediate strength builder. Beginners can start with band-assisted reps. After 6 weeks of consistent chin-ups, users typically experience significant bicep hypertrophy and improved pulling strength.',
    detailedDescription: 'The chin-up is a vertical pulling variation using an underhand grip. This grip places the biceps in a highly advantageous position, heavily targeting the lats and biceps. It is slightly easier than a pull-up, making it a great intermediate strength builder. Beginners can start with band-assisted reps. After 6 weeks of consistent chin-ups, users typically experience significant bicep hypertrophy and improved pulling strength.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Lats', 'Biceps', 'Upper Back'],
    primaryMuscles: ['Latissimus Dorsi', 'Biceps Brachii'],
    secondaryMuscles: ['Brachialis', 'Core'],
    equipment: ['Pull-up Bar'],
    movementPattern: 'Vertical Pull',
    instructions: [
      'Hang from a bar with a supinated (underhand) grip, roughly shoulder-width apart.',
      'Brace your core and pull your shoulders down.',
      'Pull yourself up until your collarbone reaches the bar.',
      'Lower yourself completely back to a dead hang.'
    ],
    commonMistakes: [
      'Stopping short of the bottom (keeping arms bent at the bottom).',
      'Swinging the legs to generate momentum.'
    ],
    benefits: [
      'Excellent compound movement for massive bicep growth.',
      'Generally easier on the shoulders for those with mobility restrictions compared to pull-ups.'
    ],
    expectedImprovements: 'After 6 weeks of consistent chin-ups, users typically experience significant bicep hypertrophy and improved pulling strength.',
    programming: {
      beginner: { sets: '3', reps: '4–8', rest: '90 sec', variation: 'Band-assisted Chin-ups' },
      intermediate: { sets: '3-4', reps: '8–15', rest: '90 sec', variation: 'Strict Chin-ups' },
      advanced: { sets: '4', reps: '5–10', rest: '120 sec', variation: 'Weighted Chin-ups' }
    },
    imageUrl: '/images/exercises/chin-ups.jpg',
  },
  {
    name: 'Dips',
    slug: 'dips',
    description: 'Parallel bar dips are a heavy compound pushing exercise that develops the lower pectorals, anterior deltoids, and triceps. They are essential for building upper body mass and lockout strength. They are suitable for intermediate athletes with healthy shoulders. Beginners can regress to bench dips or use resistance bands. In 6 weeks, consistent training often yields thicker triceps and a much stronger overhead and bench press.',
    detailedDescription: 'Parallel bar dips are a heavy compound pushing exercise that develops the lower pectorals, anterior deltoids, and triceps. They are essential for building upper body mass and lockout strength. They are suitable for intermediate athletes with healthy shoulders. Beginners can regress to bench dips or use resistance bands. In 6 weeks, consistent training often yields thicker triceps and a much stronger overhead and bench press.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    primaryMuscles: ['Pectoralis Major (Lower)', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoid'],
    equipment: ['Dip Bars'],
    movementPattern: 'Vertical Push',
    instructions: [
      'Support yourself on dip bars with arms straight and shoulders depressed (pushed down).',
      'Lean slightly forward to target the chest, or stay upright for triceps.',
      'Lower yourself by bending your elbows until your shoulders are slightly below your elbows.',
      'Push back up to the starting position.'
    ],
    commonMistakes: [
      'Shrugging the shoulders up to the ears (scapular elevation).',
      'Not descending far enough (half reps).',
      'Descending too far without adequate shoulder mobility, risking injury.'
    ],
    benefits: [
      'Massive hypertrophic stimulus for the chest and triceps.',
      'Improves lockout strength for overhead presses and bench presses.',
      'Scales easily with a weight belt for elite strength development.'
    ],
    expectedImprovements: 'In 6 weeks, consistent training often yields thicker triceps and a much stronger overhead and bench press.',
    programming: {
      beginner: { sets: '3', reps: '5–8', rest: '90 sec', variation: 'Band-assisted Dips or Bench Dips' },
      intermediate: { sets: '3-4', reps: '8–15', rest: '90 sec', variation: 'Standard Bodyweight Dips' },
      advanced: { sets: '4-5', reps: '5–10', rest: '120–180 sec', variation: 'Weighted Dips' }
    },
    progressionSteps: [
      { level: 1, title: 'Bench Dips' },
      { level: 2, title: 'Band-Assisted Dips' },
      { level: 3, title: 'Negative (Eccentric) Dips' },
      { level: 4, title: 'Standard Dips' },
      { level: 5, title: 'Weighted Dips' }
    ],
    imageUrl: '/images/exercises/dips.jpg',
  },
  {
    name: 'Bulgarian Split Squat',
    slug: 'bulgarian-split-squat',
    description: 'The Bulgarian split squat is a brutal unilateral leg exercise that targets the quadriceps and glutes while elevating the rear foot. It fixes left-to-right strength imbalances and removes heavy spinal loading. It is perfect for intermediate lifters and athletes seeking hypertrophy and balance. Beginners can start with standard split squats on the floor. After 6 weeks, trainees frequently notice reduced leg strength asymmetries, better balance, and highly defined quads.',
    detailedDescription: 'The Bulgarian split squat is a brutal unilateral leg exercise that targets the quadriceps and glutes while elevating the rear foot. It fixes left-to-right strength imbalances and removes heavy spinal loading. It is perfect for intermediate lifters and athletes seeking hypertrophy and balance. Beginners can start with standard split squats on the floor. After 6 weeks, trainees frequently notice reduced leg strength asymmetries, better balance, and highly defined quads.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Hypertrophy',
    muscleGroups: ['Quads', 'Glutes'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: ['Bench', 'Dumbbells'],
    movementPattern: 'Lunge',
    instructions: [
      'Stand a few feet in front of a bench, holding dumbbells by your sides.',
      'Reach one leg back and place the top of your foot on the bench.',
      'Keep your chest up and lower your hips until your front thigh is parallel to the ground.',
      'Push through the heel of your front foot to return to the top.'
    ],
    commonMistakes: [
      'Standing too close or too far from the bench, causing awkward knee angles.',
      'Using the back leg to help push the weight up (it should only be for balance).',
      'Leaning too far forward, stressing the lower back.'
    ],
    benefits: [
      'Unparalleled for building leg muscle without heavy spinal loading.',
      'Corrects leg strength imbalances.',
      'Highly functional for athletes.'
    ],
    expectedImprovements: 'After 6 weeks, trainees frequently notice reduced leg strength asymmetries, better balance, and highly defined quads.',
    programming: {
      beginner: { sets: '3', reps: '8–10 / leg', rest: '90 sec', variation: 'Bodyweight Split Squat (feet on floor)' },
      intermediate: { sets: '3', reps: '10–15 / leg', rest: '90 sec', variation: 'Dumbbell Bulgarian Split Squat' },
      advanced: { sets: '4', reps: '8–12 / leg', rest: '120 sec', variation: 'Heavy Barbell Bulgarian Split Squat' }
    },
    imageUrl: '/images/exercises/bulgarian-split-squat.jpg',
  },
  {
    name: 'Hanging Leg Raise',
    slug: 'hanging-leg-raise',
    description: 'Hanging leg raises are an advanced abdominal exercise that heavily targets the lower abs and hip flexors. By hanging from a bar, the spine is decompressed while the core works through a massive range of motion. It is suited for intermediate individuals with decent grip strength. Beginners should start with hanging knee raises. Over 6 weeks of consistent practice, users generally notice significantly improved lower abdominal strength, better grip endurance, and progress towards touching their toes to the bar.',
    detailedDescription: 'Hanging leg raises are an advanced abdominal exercise that heavily targets the lower abs and hip flexors. By hanging from a bar, the spine is decompressed while the core works through a massive range of motion. It is suited for intermediate individuals with decent grip strength. Beginners should start with hanging knee raises. Over 6 weeks of consistent practice, users generally notice significantly improved lower abdominal strength, better grip endurance, and progress towards touching their toes to the bar.',
    category: 'Calisthenics',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Core', 'Hip Flexors', 'Grip'],
    primaryMuscles: ['Rectus Abdominis', 'Hip Flexors'],
    secondaryMuscles: ['Obliques', 'Forearms'],
    equipment: ['Pull-up Bar'],
    movementPattern: 'Flexion',
    instructions: [
      'Hang from a pull-up bar with an overhand grip and engaged shoulders.',
      'Keeping your legs perfectly straight, brace your core and lift your legs upwards.',
      'Continue lifting until your toes touch the bar (or as high as your mobility allows).',
      'Lower your legs slowly and under control to prevent swinging.'
    ],
    commonMistakes: [
      'Swinging wildly to use momentum rather than muscle.',
      'Bending the knees (which turns it into a knee raise and makes it much easier).',
      'Dropping the legs quickly instead of controlling the eccentric phase.'
    ],
    benefits: [
      'Builds a blocky, strong six-pack.',
      'Improves grip strength and shoulder stability.',
      'Enhances hip flexor strength for sprinting and jumping.'
    ],
    expectedImprovements: 'Over 6 weeks of consistent practice, users generally notice significantly improved lower abdominal strength, better grip endurance, and progress towards touching their toes to the bar.',
    programming: {
      beginner: { sets: '3', reps: '8–12', rest: '60 sec', variation: 'Hanging Knee Raises' },
      intermediate: { sets: '3-4', reps: '8–12', rest: '90 sec', variation: 'Hanging Straight Leg Raises (to 90 degrees)' },
      advanced: { sets: '4', reps: '10–15', rest: '90 sec', variation: 'Toes-to-Bar' }
    },
    progressionSteps: [
      { level: 1, title: 'Lying Leg Raises' },
      { level: 2, title: 'Hanging Knee Raises' },
      { level: 3, title: 'Hanging Leg Raises (90 degrees)' },
      { level: 4, title: 'Strict Toes-to-Bar' }
    ],
    imageUrl: '/images/exercises/hanging-leg-raise.jpg',
  },
  {
    name: 'Pike Push-up',
    slug: 'pike-push-up',
    description: 'The pike push-up alters the angle of a standard push-up to shift the load heavily onto the shoulders. It is the primary building block for learning the handstand push-up and effectively mimics overhead pressing mechanics. It is ideal for intermediate trainees wanting to build shoulder mass with bodyweight. Beginners can regress to high-incline push-ups. In 6 weeks, individuals can expect noticeably stronger deltoids and the ability to elevate their feet for harder variations.',
    detailedDescription: 'The pike push-up alters the angle of a standard push-up to shift the load heavily onto the shoulders. It is the primary building block for learning the handstand push-up and effectively mimics overhead pressing mechanics. It is ideal for intermediate trainees wanting to build shoulder mass with bodyweight. Beginners can regress to high-incline push-ups. In 6 weeks, individuals can expect noticeably stronger deltoids and the ability to elevate their feet for harder variations.',
    category: 'Calisthenics',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    primaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    secondaryMuscles: ['Upper Chest', 'Core'],
    equipment: ['No Equipment'],
    movementPattern: 'Vertical Push',
    instructions: [
      'Start in a downward dog position, with your hips high in the air and your body forming an inverted V.',
      'Keep your legs and back straight.',
      'Lower your head towards the floor, aiming slightly in front of your hands to create a tripod shape with your head and hands.',
      'Push back up and push your head "through the window" of your arms.'
    ],
    commonMistakes: [
      'Placing the head exactly between the hands (poor mechanics).',
      'Bending the knees or dropping the hips, turning it back into a standard push-up.'
    ],
    benefits: [
      'Safely builds overhead pressing strength.',
      'Perfect progression step toward handstand push-ups.',
      'Improves hamstring and shoulder mobility.'
    ],
    expectedImprovements: 'In 6 weeks, individuals can expect noticeably stronger deltoids and the ability to elevate their feet for harder variations.',
    programming: {
      beginner: { sets: '3', reps: '5–8', rest: '90 sec', variation: 'Standard Pike Push-ups' },
      intermediate: { sets: '3-4', reps: '8–12', rest: '90 sec', variation: 'Feet-Elevated Pike Push-ups' },
      advanced: { sets: '4', reps: '5–8', rest: '120 sec', variation: 'Wall Handstand Push-ups' }
    },
    imageUrl: '/images/exercises/pike-push-up.jpg',
  },
  {
    name: 'Barbell Squats',
    slug: 'barbell-squats',
    description: 'The barbell back squat is considered the ultimate lower body strength builder. It forces the entire body to stabilize a heavy load while the quads, hamstrings, and glutes perform deep flexion. It is essential for athletes and intermediate lifters aiming to maximize absolute strength. Beginners should master the goblet squat first. Over 6 weeks of linear progression, expect significant gains in lower body power, thicker quadriceps, and a much higher 1-rep max.',
    detailedDescription: 'The barbell back squat is considered the ultimate lower body strength builder. It forces the entire body to stabilize a heavy load while the quads, hamstrings, and glutes perform deep flexion. It is essential for athletes and intermediate lifters aiming to maximize absolute strength. Beginners should master the goblet squat first. Over 6 weeks of linear progression, expect significant gains in lower body power, thicker quadriceps, and a much higher 1-rep max.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Core'],
    equipment: ['Barbell'],
    movementPattern: 'Squat',
    instructions: [
      'Set the barbell on a rack at upper-chest height. Step under the bar, resting it on your traps (high bar) or rear delts (low bar).',
      'Unrack the bar and take one or two deliberate steps back. Place feet slightly wider than shoulder-width with toes pointed slightly out.',
      'Take a deep breath into your belly and brace your core.',
      'Squat down by breaking at the hips and knees simultaneously. Keep your chest up and back straight.',
      'Descend until your hip crease is below your knee (parallel or below).',
      'Drive aggressively back up through the mid-foot to the starting position and exhale.'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse) during the ascent.',
      'Good-morning the squat (hips shoot up faster than the chest).',
      'Not hitting parallel depth (half squats).'
    ],
    benefits: [
      'Triggers massive whole-body strength and hypertrophic adaptations.',
      'Builds foundational strength required for athletic performance and jumping.',
      'Fortifies the core, lower back, and joints when performed correctly.'
    ],
    expectedImprovements: 'Over 6 weeks of linear progression, expect significant gains in lower body power, thicker quadriceps, and a much higher 1-rep max.',
    programming: {
      beginner: { sets: '3', reps: '5–8', rest: '120–180 sec', variation: 'Goblet Squat or Box Squat' },
      intermediate: { sets: '4', reps: '4–6', rest: '180+ sec', variation: 'Barbell Back Squat' },
      advanced: { sets: '5', reps: '1–5', rest: '180–300 sec', variation: 'Heavy Back Squat / Paused Squat' }
    },
    imageUrl: '/images/exercises/barbell-squats.jpg',
  },
  {
    name: 'Bench Press',
    slug: 'bench-press',
    description: 'The barbell bench press is a compound horizontal press that builds a massive chest, front delts, and triceps. Proper setup requires retracting the scapula and maintaining a tight core. It is the standard for intermediate lifters wanting to build horizontal pushing strength. Beginners can utilize dumbbell presses for better joint freedom. After 6 weeks, users typically see a thicker chest, stronger triceps, and a steady increase in the weight they can safely press.',
    detailedDescription: 'The barbell bench press is a compound horizontal press that builds a massive chest, front delts, and triceps. Proper setup requires retracting the scapula and maintaining a tight core. It is the standard for intermediate lifters wanting to build horizontal pushing strength. Beginners can utilize dumbbell presses for better joint freedom. After 6 weeks, users typically see a thicker chest, stronger triceps, and a steady increase in the weight they can safely press.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    primaryMuscles: ['Pectoralis Major'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    equipment: ['Barbell', 'Bench'],
    movementPattern: 'Horizontal Push',
    instructions: [
      'Lie flat on a bench with your eyes directly under the bar.',
      'Grip the bar slightly wider than shoulder-width.',
      'Pinch your shoulder blades together and plant your feet firmly on the floor.',
      'Unrack the bar and lower it under control to your mid-chest (sternum).',
      'Pause briefly, then press the bar explosively back to the top.'
    ],
    commonMistakes: [
      'Flaring the elbows out to 90 degrees.',
      'Bouncing the bar off the chest.',
      'Lifting the glutes off the bench during the press.'
    ],
    benefits: [
      'The most effective exercise for overall chest hypertrophy and strength.',
      'Allows for very heavy loading.',
      'Improves lockout strength.'
    ],
    expectedImprovements: 'After 6 weeks, users typically see a thicker chest, stronger triceps, and a steady increase in the weight they can safely press.',
    programming: {
      beginner: { sets: '3', reps: '8–10', rest: '90–120 sec', variation: 'Dumbbell Bench Press' },
      intermediate: { sets: '4', reps: '5–8', rest: '120–180 sec', variation: 'Barbell Bench Press' },
      advanced: { sets: '5', reps: '3–5', rest: '180–300 sec', variation: 'Heavy Barbell Bench Press' }
    },
    imageUrl: '/images/exercises/bench-press.jpg',
  },
  {
    name: 'Barbell Rows',
    slug: 'barbell-rows',
    description: 'The barbell bent-over row is a heavy horizontal pull that builds a thick, strong back. It targets the lats, rhomboids, and traps while forcing the lower back to work isometrically. It is highly recommended for intermediate lifters seeking postural strength and back thickness. Beginners should start with chest-supported dumbbell rows. With 6 weeks of practice, users can expect a significantly thicker upper back and improved stability in their bench press and deadlift.',
    detailedDescription: 'The barbell bent-over row is a heavy horizontal pull that builds a thick, strong back. It targets the lats, rhomboids, and traps while forcing the lower back to work isometrically. It is highly recommended for intermediate lifters seeking postural strength and back thickness. Beginners should start with chest-supported dumbbell rows. With 6 weeks of practice, users can expect a significantly thicker upper back and improved stability in their bench press and deadlift.',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    exerciseType: 'Strength',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps', 'Lower Back'],
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Erector Spinae'],
    equipment: ['Barbell'],
    movementPattern: 'Horizontal Pull',
    instructions: [
      'Stand holding a barbell with a shoulder-width overhand grip.',
      'Hinge at your hips, pushing your glutes back and keeping your back perfectly straight. Your torso should be roughly 45 degrees to parallel with the floor.',
      'Let the bar hang directly in front of you with arms fully extended.',
      'Pull the bar forcefully to your lower chest/upper stomach by driving your elbows up and back.',
      'Squeeze your shoulder blades together at the top.',
      'Lower the bar under control.'
    ],
    commonMistakes: [
      'Using excessive momentum and throwing the lower back into the lift.',
      'Standing up too upright, turning the row into a shrug.',
      'Rounding the lower back (danger of injury).'
    ],
    benefits: [
      'Develops immense back thickness and postural strength.',
      'Balances the horizontal pushing muscles built by the bench press.',
      'Strengthens the posterior chain.'
    ],
    expectedImprovements: 'With 6 weeks of practice, users can expect a significantly thicker upper back and improved stability in their bench press and deadlift.',
    programming: {
      beginner: { sets: '3', reps: '8–12', rest: '90 sec', variation: 'Dumbbell Rows / Chest-Supported Rows' },
      intermediate: { sets: '4', reps: '6–10', rest: '120 sec', variation: 'Barbell Bent-Over Rows' },
      advanced: { sets: '4-5', reps: '5–8', rest: '120–180 sec', variation: 'Pendlay Rows' }
    },
    imageUrl: '/images/exercises/barbell-rows.jpg',
  },

  // =========================================================
  // ADVANCED / ELITE (Skills & Strength)
  // =========================================================
  {
    name: 'Handstand Push-up',
    slug: 'handstand-push-up',
    description: 'The strict handstand push-up is an advanced calisthenics skill requiring extreme shoulder strength. By pressing your entire body weight vertically, it builds massive anterior deltoids and triceps while demanding core control. It is designed for advanced athletes who have mastered the pike push-up and wall handstand hold. Progression requires patience. Over 6 weeks of targeted training, practitioners can expect a significant increase in pressing power and progress towards a freestanding press.',
    detailedDescription: 'The strict handstand push-up is an advanced calisthenics skill requiring extreme shoulder strength. By pressing your entire body weight vertically, it builds massive anterior deltoids and triceps while demanding core control. It is designed for advanced athletes who have mastered the pike push-up and wall handstand hold. Progression requires patience. Over 6 weeks of targeted training, practitioners can expect a significant increase in pressing power and progress towards a freestanding press.',
    category: 'Calisthenics',
    difficulty: 'Advanced',
    exerciseType: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    primaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    secondaryMuscles: ['Upper Chest', 'Core'],
    equipment: ['No Equipment'],
    movementPattern: 'Vertical Push',
    instructions: [
      'Kick up into a handstand against a wall, facing away from the wall.',
      'Keep your core tight, legs straight, and body rigid.',
      'Lower yourself slowly until the top of your head gently touches the floor. Your arms and head should form a tripod shape.',
      'Press powerfully back up to a full elbow lockout.'
    ],
    commonMistakes: [
      'Flaring the elbows straight out laterally.',
      'Over-arching the lower back (banana back) due to weak core bracing.',
      'Crashing the head onto the floor.'
    ],
    benefits: [
      'Builds elite relative shoulder strength.',
      'Develops balance and spatial awareness.',
      'Requires zero equipment.'
    ],
    expectedImprovements: 'Over 6 weeks of targeted training, practitioners can expect a significant increase in pressing power and progress towards a freestanding press.',
    programming: {
      beginner: { sets: '3', reps: '6–10', rest: '90 sec', variation: 'Pike Push-ups' },
      intermediate: { sets: '4', reps: '4–8', rest: '120 sec', variation: 'Wall Handstand Push-ups' },
      advanced: { sets: '5', reps: '3–6', rest: '180 sec', variation: 'Freestanding Handstand Push-ups or Deficit HSPU' }
    },
    progressionSteps: [
      { level: 1, title: 'Pike Push-up' },
      { level: 2, title: 'Elevated Pike Push-up' },
      { level: 3, title: 'Wall Handstand Hold' },
      { level: 4, title: 'Negative (Eccentric) Wall HSPU' },
      { level: 5, title: 'Strict Wall Handstand Push-up' }
    ],
    imageUrl: '/images/exercises/handstand-push-up.jpg',
  },
  {
    name: 'Front Lever',
    slug: 'front-lever',
    description: 'The Front Lever is an elite straight-arm isometric hold on a bar or rings. The athlete pulls their entire body until it is completely horizontal, requiring superhuman strength in the lats and core. It is an elite skill meant for highly advanced calisthenics practitioners. Beginners must spend months mastering tuck variations. With 6 weeks of disciplined training, an athlete can expect to graduate from a Tuck Front Lever to an Advanced Tuck, showing noticeable gains in lat thickness.',
    detailedDescription: 'The Front Lever is an elite straight-arm isometric hold on a bar or rings. The athlete pulls their entire body until it is completely horizontal, requiring superhuman strength in the lats and core. It is an elite skill meant for highly advanced calisthenics practitioners. Beginners must spend months mastering tuck variations. With 6 weeks of disciplined training, an athlete can expect to graduate from a Tuck Front Lever to an Advanced Tuck, showing noticeable gains in lat thickness.',
    category: 'Calisthenics',
    difficulty: 'Elite',
    exerciseType: 'Skill',
    muscleGroups: ['Lats', 'Core', 'Rhomboids'],
    primaryMuscles: ['Latissimus Dorsi', 'Core', 'Rhomboids'],
    secondaryMuscles: ['Posterior Deltoid', 'Triceps (Long Head)'],
    equipment: ['Pull-up Bar', 'Rings'],
    movementPattern: 'Isometric',
    instructions: [
      'Hang from a bar with a firm overhand grip.',
      'Retract and depress your scapula.',
      'Engage your lats to pull your body upward while simultaneously keeping your legs straight and core completely rigid.',
      'Stop when your entire body is parallel to the ground and hold the position.'
    ],
    commonMistakes: [
      'Piking at the hips (body is not in a straight line).',
      'Bending the elbows to compensate for weak lats.',
      'Rounding the upper back excessively.'
    ],
    benefits: [
      'Builds one of the strongest backs achievable with bodyweight training.',
      'Incredible demonstration of total-body tension.',
      'Improves performance in all other pulling movements.'
    ],
    expectedImprovements: 'With 6 weeks of disciplined training, an athlete can expect to graduate from a Tuck Front Lever to an Advanced Tuck, showing noticeable gains in lat thickness.',
    programming: {
      beginner: { sets: '4', reps: '10–20 sec hold', rest: '90 sec', variation: 'Tuck Front Lever' },
      intermediate: { sets: '4', reps: '10–15 sec hold', rest: '120 sec', variation: 'Advanced Tuck or Straddle Front Lever' },
      advanced: { sets: '5', reps: '5–10 sec hold', rest: '180 sec', variation: 'Full Front Lever' }
    },
    progressionSteps: [
      { level: 1, title: 'Tuck Front Lever' },
      { level: 2, title: 'Advanced Tuck Front Lever' },
      { level: 3, title: 'One-Leg Front Lever' },
      { level: 4, title: 'Straddle Front Lever' },
      { level: 5, title: 'Full Front Lever' }
    ],
    imageUrl: '/images/exercises/front-lever.jpg',
  },
  {
    name: 'Planche',
    slug: 'planche',
    description: 'The Planche is arguably the most difficult calisthenics static hold. It involves balancing the entire body horizontally on the hands while the feet are suspended. It requires extreme anterior deltoid strength, straight-arm conditioning, and lower back strength. It is exclusively for elite practitioners. Beginners must strictly practice planche leans. In 6 weeks of Planche Lean training, expect significantly stronger shoulders and improved straight-arm joint resilience.',
    detailedDescription: 'The Planche is arguably the most difficult calisthenics static hold. It involves balancing the entire body horizontally on the hands while the feet are suspended. It requires extreme anterior deltoid strength, straight-arm conditioning, and lower back strength. It is exclusively for elite practitioners. Beginners must strictly practice planche leans. In 6 weeks of Planche Lean training, expect significantly stronger shoulders and improved straight-arm joint resilience.',
    category: 'Calisthenics',
    difficulty: 'Elite',
    exerciseType: 'Skill',
    muscleGroups: ['Shoulders', 'Biceps', 'Core', 'Chest'],
    primaryMuscles: ['Anterior Deltoid', 'Biceps Brachii', 'Core'],
    secondaryMuscles: ['Pectoralis Major', 'Lower Back'],
    equipment: ['Parallettes', 'No Equipment'],
    movementPattern: 'Isometric',
    instructions: [
      'Place your hands on the floor or parallettes, positioned near your waist.',
      'Lock your elbows completely straight and protract your shoulder blades (push them apart).',
      'Lean forward significantly until your center of gravity shifts over your hands, allowing your feet to float off the floor.',
      'Keep your body in a perfectly straight, horizontal line.'
    ],
    commonMistakes: [
      'Bending the elbows (this turns it into an elbow lever and removes the strain from the shoulders).',
      'Piking the hips in the air.',
      'Retracting the scapula instead of protracting it.'
    ],
    benefits: [
      'Produces unparalleled shoulder and connective tissue strength.',
      'The ultimate party trick and display of gymnastics strength.',
      'Builds massive anterior deltoids and biceps.'
    ],
    expectedImprovements: 'In 6 weeks of Planche Lean training, expect significantly stronger shoulders and improved straight-arm joint resilience.',
    programming: {
      beginner: { sets: '4', reps: '15–30 sec hold', rest: '90 sec', variation: 'Planche Leans or Frog Stand' },
      intermediate: { sets: '4', reps: '10–20 sec hold', rest: '120 sec', variation: 'Tuck Planche' },
      advanced: { sets: '5', reps: '5–10 sec hold', rest: '180 sec', variation: 'Straddle or Full Planche' }
    },
    progressionSteps: [
      { level: 1, title: 'Planche Leans' },
      { level: 2, title: 'Tuck Planche' },
      { level: 3, title: 'Advanced Tuck Planche' },
      { level: 4, title: 'Straddle Planche' },
      { level: 5, title: 'Full Planche' }
    ],
    imageUrl: '/images/exercises/planche.jpg',
  },
  {
    name: 'Muscle-up',
    slug: 'muscle-up',
    description: 'The strict muscle-up is a holy grail calisthenics skill. It combines an explosive pull-up, a complex mechanical transition over the bar, and a straight bar dip. It requires immense pulling power and tricep strength to complete. It is suited for advanced athletes who can already perform 15 strict pull-ups. Progressing to a muscle-up takes months. Within 6 weeks of targeted training, expect higher explosive pull-ups and deeper straight bar dips.',
    detailedDescription: 'The strict muscle-up is a holy grail calisthenics skill. It combines an explosive pull-up, a complex mechanical transition over the bar, and a straight bar dip. It requires immense pulling power and tricep strength to complete. It is suited for advanced athletes who can already perform 15 strict pull-ups. Progressing to a muscle-up takes months. Within 6 weeks of targeted training, expect higher explosive pull-ups and deeper straight bar dips.',
    category: 'Calisthenics',
    difficulty: 'Advanced',
    exerciseType: 'Skill',
    muscleGroups: ['Lats', 'Chest', 'Triceps', 'Biceps'],
    primaryMuscles: ['Latissimus Dorsi', 'Triceps Brachii', 'Core'],
    secondaryMuscles: ['Biceps', 'Pectoralis Major', 'Forearms'],
    equipment: ['Pull-up Bar', 'Rings'],
    movementPattern: 'Hybrid Pull/Push',
    instructions: [
      'Hang from a bar with a false grip or a slight swing to generate momentum (if not doing strict).',
      'Perform an explosive pull-up, pulling the bar down to your waist rather than your chin.',
      'As your chest reaches the bar, aggressively lean forward to transition your weight over the bar.',
      'Once over the bar, press out of the dip until your arms are fully locked.'
    ],
    commonMistakes: [
      'Chicken-winging (transitioning one arm over the bar before the other, risking shoulder injury).',
      'Not pulling high enough or explosively enough before attempting the transition.',
      'Failing to lean over the bar during the transition phase.'
    ],
    benefits: [
      'Develops elite explosive pulling power.',
      'Unmatched demonstration of upper body control and strength.',
      'Builds massive forearms, lats, and triceps.'
    ],
    expectedImprovements: 'Within 6 weeks of targeted training, expect higher explosive pull-ups and deeper straight bar dips.',
    programming: {
      beginner: { sets: '4', reps: '4–6', rest: '120 sec', variation: 'Explosive High Pull-ups & Straight Bar Dips' },
      intermediate: { sets: '4', reps: '3–5', rest: '120–180 sec', variation: 'Band-Assisted Muscle-ups or Jumping Muscle-ups' },
      advanced: { sets: '5', reps: '2–5', rest: '180+ sec', variation: 'Strict Muscle-ups' }
    },
    progressionSteps: [
      { level: 1, title: '10 Strict Pull-ups & 10 Straight Bar Dips' },
      { level: 2, title: 'Explosive High Pull-ups (Bar to chest)' },
      { level: 3, title: 'Jumping Muscle-ups (Low bar)' },
      { level: 4, title: 'Band-Assisted Muscle-ups' },
      { level: 5, title: 'Strict Muscle-up' }
    ],
    imageUrl: '/images/exercises/muscle-up.jpg',
  },
  {
    name: 'L-sit',
    slug: 'l-sit',
    description: 'The L-Sit is a straight-arm core and hip-flexor strength skill that develops compression strength, shoulder stability, and full-body tension. By supporting your bodyweight on your hands and locking your legs out horizontally, it places immense tension on the core. It is an advanced skill, but beginners can start with supported tuck holds and gradually extend the legs. With consistent training for around 6 weeks, many beginners may notice better core control, improved work capacity, and stronger movement mechanics.',
    detailedDescription: 'The L-Sit is a straight-arm core and hip-flexor strength skill that develops compression strength, shoulder stability, and full-body tension. By supporting your bodyweight on your hands and locking your legs out horizontally, it places immense tension on the core. It is an advanced skill, but beginners can start with supported tuck holds and gradually extend the legs. With consistent training for around 6 weeks, many beginners may notice better core control, improved work capacity, and stronger movement mechanics.',
    category: 'Calisthenics',
    difficulty: 'Advanced',
    exerciseType: 'Skill',
    muscleGroups: ['Core', 'Hip Flexors', 'Triceps'],
    primaryMuscles: ['Rectus Abdominis', 'Hip Flexors', 'Quadriceps'],
    secondaryMuscles: ['Triceps Brachii', 'Shoulders'],
    equipment: ['Parallettes', 'No Equipment'],
    movementPattern: 'Isometric',
    instructions: [
      'Support yourself on parallettes or the floor with arms completely locked and shoulders depressed.',
      'Keep your chest up and core tight.',
      'Lift both legs straight out in front of you until they are parallel to the floor, forming an L-shape with your torso.',
      'Point your toes, lock your knees, and hold the position.'
    ],
    commonMistakes: [
      'Bending the knees due to weak quads or tight hamstrings.',
      'Shrugging the shoulders up instead of actively depressing the scapula.',
      'Leaning too far back.'
    ],
    benefits: [
      'Builds incredible core compression strength.',
      'Strengthens the hip flexors significantly.',
      'Foundation for advanced gymnastics skills like the V-sit or Planche.'
    ],
    expectedImprovements: 'With consistent training for around 6 weeks, many beginners may notice better core control, improved work capacity, and stronger movement mechanics.',
    programming: {
      beginner: { sets: '4', reps: '10–20 sec hold', rest: '60 sec', variation: 'Tuck L-sit or One-Leg L-sit' },
      intermediate: { sets: '4', reps: '15–30 sec hold', rest: '90 sec', variation: 'Full L-sit' },
      advanced: { sets: '4', reps: '10–20 sec hold', rest: '120 sec', variation: 'V-sit or L-sit on Rings' }
    },
    progressionSteps: [
      { level: 1, title: 'Supported Tuck Hold' },
      { level: 2, title: 'One-Leg Extended Hold' },
      { level: 3, title: 'Advanced Tuck L-sit' },
      { level: 4, title: 'Full L-sit' },
      { level: 5, title: 'V-sit' }
    ],
    imageUrl: '/images/exercises/l-sit.jpg',
  },
  {
    name: 'Pistol Squat',
    slug: 'pistol-squat',
    description: 'The pistol squat is an advanced single-leg squat requiring extreme unilateral leg strength, ankle mobility, and core compression. It is the pinnacle of bodyweight leg training. It is suited for advanced trainees. Beginners should focus on box step-ups and assisted pistols to build the required balance. In 6 weeks of targeted mobility and assisted practice, expect to achieve significantly improved ankle dorsiflexion and unilateral stability.',
    detailedDescription: 'The pistol squat is an advanced single-leg squat requiring extreme unilateral leg strength, ankle mobility, and core compression. It is the pinnacle of bodyweight leg training. It is suited for advanced trainees. Beginners should focus on box step-ups and assisted pistols to build the required balance. In 6 weeks of targeted mobility and assisted practice, expect to achieve significantly improved ankle dorsiflexion and unilateral stability.',
    category: 'Calisthenics',
    difficulty: 'Advanced',
    exerciseType: 'Skill',
    muscleGroups: ['Quads', 'Glutes', 'Core'],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hip Flexors'],
    secondaryMuscles: ['Core', 'Anterior Tibialis'],
    equipment: ['No Equipment'],
    movementPattern: 'Squat',
    instructions: [
      'Stand on one leg, extending the other leg straight out in front of you.',
      'Extend your arms forward for balance.',
      'Squat down on the supporting leg, going as deep as possible (hamstring resting on calf).',
      'Keep your heel on the ground and your extended leg off the floor.',
      'Drive powerfully back up to a standing position.'
    ],
    commonMistakes: [
      'Lifting the heel of the working leg off the ground (lack of ankle mobility).',
      'Collapsing at the bottom and losing tension.',
      'Letting the extended leg touch the ground.'
    ],
    benefits: [
      'Builds elite unilateral leg strength.',
      'Improves ankle and hip mobility.',
      'Requires zero equipment for an intense leg workout.'
    ],
    expectedImprovements: 'In 6 weeks of targeted mobility and assisted practice, expect to achieve significantly improved ankle dorsiflexion and unilateral stability.',
    programming: {
      beginner: { sets: '3', reps: '5–8 / leg', rest: '90 sec', variation: 'Box Pistol Squats or TRX Assisted Pistols' },
      intermediate: { sets: '4', reps: '5–10 / leg', rest: '120 sec', variation: 'Full Pistol Squats' },
      advanced: { sets: '4', reps: '5–8 / leg', rest: '120 sec', variation: 'Weighted Pistol Squats' }
    },
    progressionSteps: [
      { level: 1, title: 'Assisted Pistols (Holding a pole)' },
      { level: 2, title: 'Box Pistol Squats (Squatting onto a box)' },
      { level: 3, title: 'Elevated Pistols (Standing on a box)' },
      { level: 4, title: 'Full Pistol Squats' },
      { level: 5, title: 'Weighted Pistol Squats' }
    ],
    imageUrl: '/images/exercises/pistol-squat.jpg',
  },
  {
    name: 'Ab Rollout',
    slug: 'ab-rollout',
    description: 'The ab rollout is an elite anti-extension core exercise. As you roll forward, gravity tries to force your spine into extension. Your core must fight this force to keep the spine neutral, resulting in extreme abdominal engagement. It is meant for intermediate to advanced trainees. Beginners must limit range of motion by rolling toward a wall. After 6 weeks, expect to roll out significantly further while maintaining a flat back, resulting in a stronger and more defined core.',
    detailedDescription: 'The ab rollout is an elite anti-extension core exercise. As you roll forward, gravity tries to force your spine into extension. Your core must fight this force to keep the spine neutral, resulting in extreme abdominal engagement. It is meant for intermediate to advanced trainees. Beginners must limit range of motion by rolling toward a wall. After 6 weeks, expect to roll out significantly further while maintaining a flat back, resulting in a stronger and more defined core.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    exerciseType: 'Strength',
    muscleGroups: ['Core', 'Lats'],
    primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Latissimus Dorsi', 'Triceps'],
    equipment: ['Other'],
    movementPattern: 'Anti-extension',
    instructions: [
      'Kneel on a soft pad and hold the ab wheel with both hands.',
      'Tuck your pelvis (hollow body position) and lock your arms.',
      'Slowly roll the wheel forward as far as you can without letting your lower back arch or sag.',
      'Use your core (not your hips) to pull the wheel back to the starting position.'
    ],
    commonMistakes: [
      'Arching the lower back (danger of severe lower back injury).',
      'Sitting back on the heels to pull the wheel back instead of using the abs.',
      'Bending the arms.'
    ],
    benefits: [
      'One of the highest EMG activations for the rectus abdominis.',
      'Builds bulletproof core strength for heavy squats and deadlifts.',
      'Strengthens the lats isometrically.'
    ],
    expectedImprovements: 'After 6 weeks, expect to roll out significantly further while maintaining a flat back, resulting in a stronger and more defined core.',
    programming: {
      beginner: { sets: '3', reps: '5–8', rest: '90 sec', variation: 'Planks or Rollouts against a wall to limit ROM' },
      intermediate: { sets: '3-4', reps: '8–12', rest: '90 sec', variation: 'Kneeling Ab Rollouts (Full ROM)' },
      advanced: { sets: '4', reps: '5–10', rest: '120 sec', variation: 'Standing Ab Rollouts' }
    },
    imageUrl: '/images/exercises/ab-rollout.jpg',
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    await Exercise.deleteMany({});
    console.log('Cleared existing exercises.');

    await Exercise.insertMany(exercises);
    console.log(`Successfully seeded ${exercises.length} rich exercises.`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();
