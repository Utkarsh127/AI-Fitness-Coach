/**
 * @module modules/learning/learning.constants
 * @description Static definitions for skill roadmaps.
 */

export const ROADMAPS = [
  {
    id: 'handstand',
    title: 'Handstand Mastery',
    category: 'Handstand',
    description: 'A complete progression from zero to a freestanding handstand, building essential shoulder strength and spatial awareness.',
    estimatedDuration: '8-20+ weeks',
    difficulty: 'Beginner to Advanced',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        name: 'Plank & Hollow Body',
        level: 'Beginner',
        estimatedLevel: 1,
        description: 'Master core tension on the floor before taking it to the wall.',
        whatItBuilds: 'Core stability, anti-extension, and posterior pelvic tilt awareness.',
        howTo: [
          'Lie on your back, press your lower back into the floor.',
          'Lift your shoulders and legs slightly off the ground.',
          'Maintain a rigid straight line in a standard plank.'
        ],
        sets: '3',
        reps: '45-60 sec hold',
        rest: '60 sec',
        progressionCriteria: '3 sets of 60 seconds with perfect form.',
        estimatedTime: '1-3 weeks',
        commonMistakes: ['Arching the lower back', 'Piking the hips in the plank'],
        regression: 'Bent knee hollow body hold.',
        safetyNotes: 'Do not strain your neck.',
        skillKeyword: 'Hollow Body'
      },
      {
        id: 2,
        stepNumber: 2,
        name: 'Pike Push-ups',
        level: 'Beginner',
        estimatedLevel: 2,
        description: 'Build basic overhead pressing strength using your bodyweight.',
        whatItBuilds: 'Anterior deltoids, triceps, and upper chest.',
        howTo: [
          'Start in a downward dog position with hips high.',
          'Lower your head slightly in front of your hands to form a triangle.',
          'Push back up until arms are fully locked.'
        ],
        sets: '3-4',
        reps: '8-12 reps',
        rest: '90 sec',
        progressionCriteria: '4 sets of 10 controlled reps.',
        estimatedTime: '2-4 weeks',
        commonMistakes: ['Flaring elbows out', 'Lowering head directly between hands'],
        regression: 'Kneeling pike push-ups or standard push-ups.',
        safetyNotes: 'Keep elbows tucked to protect the shoulder joint.',
        skillKeyword: 'Pike Push-ups'
      },
      {
        id: 3,
        stepNumber: 3,
        name: 'Wall Walks',
        level: 'Foundation',
        estimatedLevel: 3,
        description: 'Get comfortable with being inverted and bearing weight on straight arms.',
        whatItBuilds: 'Shoulder endurance and fear management for being upside down.',
        howTo: [
          'Start in a push-up position with your feet against a wall.',
          'Walk your feet up the wall while walking your hands backward.',
          'Go as high as comfortable, then walk safely back down.'
        ],
        sets: '3',
        reps: '3-5 full walks',
        rest: '120 sec',
        progressionCriteria: '3 sets of 5 wall walks to a chest-to-wall position.',
        estimatedTime: '2-4 weeks',
        commonMistakes: ['Collapsing the shoulders', 'Forgetting to breathe'],
        regression: 'Hold a downward dog or high plank.',
        safetyNotes: 'Ensure your wrists are warmed up before attempting.',
        skillKeyword: 'Wall Walk'
      },
      {
        id: 4,
        stepNumber: 4,
        name: 'Box / Elevated Handstand',
        level: 'Foundation',
        estimatedLevel: 3,
        description: 'A half-inverted position to practice the stack without full body weight.',
        whatItBuilds: 'Vertical stacking (wrists, elbows, shoulders, hips).',
        howTo: [
          'Place feet on a box or chair, hands on the floor.',
          'Walk hands back until your torso is completely vertical.',
          'Push the floor away aggressively and hold.'
        ],
        sets: '3-4',
        reps: '30-45 sec hold',
        rest: '90 sec',
        progressionCriteria: '3 sets of 45 seconds.',
        estimatedTime: '2-3 weeks',
        commonMistakes: ['Piking at the shoulders (shoulders behind wrists)'],
        regression: 'Lower the box height.',
        safetyNotes: 'Ensure the box is completely stable.',
        skillKeyword: 'Box Handstand'
      },
      {
        id: 5,
        stepNumber: 5,
        name: 'Back-to-Wall Handstand',
        level: 'Intermediate',
        estimatedLevel: 4,
        description: 'Learn to kick up safely into a handstand position.',
        whatItBuilds: 'Kick-up accuracy, overhead strength, and wrist conditioning.',
        howTo: [
          'Place hands shoulder-width apart, 6-10 inches from the wall.',
          'Kick one leg up, followed by the other.',
          'Rest heels lightly against the wall and hold.'
        ],
        sets: '4',
        reps: '30-60 sec hold',
        rest: '90-120 sec',
        progressionCriteria: 'Can consistently kick up and hold for 60 seconds.',
        estimatedTime: '3-6 weeks',
        commonMistakes: ['Arching the lower back massively (banana back)'],
        regression: 'Chest-to-wall handstand if kicking up is too scary.',
        safetyNotes: 'Learn how to pirouette bail if you lose balance.',
        skillKeyword: 'Back-to-Wall'
      },
      {
        id: 6,
        stepNumber: 6,
        name: 'Wall Balance / Scissor Legs',
        level: 'Intermediate',
        estimatedLevel: 5,
        description: 'Transition from relying on the wall to balancing with the hands.',
        whatItBuilds: 'Fingertip control (cambered hand) and micro-adjustments.',
        howTo: [
          'Kick up into a back-to-wall handstand.',
          'Pull one leg slightly off the wall.',
          'Gently tap the wall with the other foot, trying to float between the wall and balance.'
        ],
        sets: '4',
        reps: '5-10 balance attempts per set',
        rest: '120 sec',
        progressionCriteria: 'Can float off the wall for 5-10 seconds consistently.',
        estimatedTime: '4-8 weeks',
        commonMistakes: ['Using shoulders to balance instead of fingers'],
        regression: 'Just hold the back-to-wall handstand longer.',
        safetyNotes: 'Keep your elbows completely locked to avoid collapsing.',
        skillKeyword: 'Wall Balance'
      },
      {
        id: 7,
        stepNumber: 7,
        name: 'Freestanding Handstand',
        level: 'Advanced',
        estimatedLevel: 7,
        description: 'The holy grail of bodyweight balance. A completely freestanding hold.',
        whatItBuilds: 'Total body control, proprioception, and mastery of the vertical line.',
        howTo: [
          'Kick up in open space.',
          'Stack wrists, shoulders, hips, and toes.',
          'Dig fingers into the ground if falling forward; press palms if falling backward.'
        ],
        sets: '5-8',
        reps: 'Max hold attempts',
        rest: 'As needed',
        progressionCriteria: 'Consistent 30+ second hold with a straight line.',
        estimatedTime: '6-12+ weeks',
        commonMistakes: ['Looking too far forward', 'Bending elbows to save balance'],
        regression: 'Return to wall scissors if struggling to catch the balance.',
        safetyNotes: 'Must know how to bail (cartwheel out or roll).',
        skillKeyword: 'Freestanding Handstand'
      },
      {
        id: 8,
        stepNumber: 8,
        name: 'Handstand Shoulder Taps',
        level: 'Elite',
        estimatedLevel: 8,
        description: 'Build extreme unilateral shoulder stability by shifting weight.',
        whatItBuilds: 'Preparation for one-arm handstands and walking.',
        howTo: [
          'Kick up into a freestanding or chest-to-wall handstand.',
          'Shift your weight entirely to your left arm.',
          'Quickly tap your right shoulder with your right hand.',
          'Repeat on the other side.'
        ],
        sets: '4',
        reps: '10-20 taps',
        rest: '120 sec',
        progressionCriteria: '20 clean, slow taps chest-to-wall.',
        estimatedTime: '4-8 weeks',
        commonMistakes: ['Moving the hips too much instead of shifting shoulders'],
        regression: 'Hold a one-arm assisted handstand (fingertips on one hand).',
        safetyNotes: 'Do this chest-to-wall before attempting freestanding.',
        skillKeyword: 'Shoulder Taps'
      },
      {
        id: 9,
        stepNumber: 9,
        name: 'Handstand Press Preparation',
        level: 'Elite',
        estimatedLevel: 9,
        description: 'Learn to press into a handstand using pure strength, no momentum.',
        whatItBuilds: 'Extreme active flexibility, shoulder strength, and core compression.',
        howTo: [
          'Start in a wide straddle stance.',
          'Place hands on the floor and lean shoulders far past wrists.',
          'Compress core and lift toes off the ground to float up.'
        ],
        sets: '3-5',
        reps: '3-5 negatives or attempts',
        rest: '180 sec',
        progressionCriteria: 'One clean straddle press to handstand.',
        estimatedTime: '12-24+ weeks',
        commonMistakes: ['Not leaning shoulders far forward enough', 'Jumping instead of pressing'],
        regression: 'Straddle press negatives (lowering slowly from handstand).',
        safetyNotes: 'Extremely taxing on the wrists. Warm up thoroughly.',
        skillKeyword: 'Handstand Press'
      }
    ]
  },
  {
    id: 'hspu',
    title: 'Handstand Push-up Mastery',
    category: 'Handstand',
    description: 'Develop elite vertical pressing strength from wall assistance to strict freestanding push-ups.',
    estimatedDuration: '10-24 weeks',
    difficulty: 'Intermediate to Elite',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Pike Push-ups', level: 'Beginner', estimatedLevel: 2,
        description: 'The foundation of overhead pushing.',
        whatItBuilds: 'Basic anterior deltoid strength.',
        howTo: ['Hips high in downward dog.', 'Lower head in front of hands.', 'Push up.'],
        sets: '4', reps: '10-15', rest: '90 sec', progressionCriteria: '4x15 reps.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Flared elbows'], regression: 'Kneeling.',
        safetyNotes: 'Keep elbows tucked.', skillKeyword: 'Pike Push-ups'
      },
      {
        id: 2, stepNumber: 2, name: 'Feet-Elevated Pike Push-ups', level: 'Foundation', estimatedLevel: 3,
        description: 'Shifts more bodyweight onto the shoulders.',
        whatItBuilds: 'Increased overhead load tolerance.',
        howTo: ['Place feet on a box or chair.', 'Perform a pike push-up.', 'Keep hips stacked over shoulders.'],
        sets: '4', reps: '8-12', rest: '120 sec', progressionCriteria: '4x12 reps.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Piking at the lower back instead of hips'], regression: 'Floor pike push-ups.',
        safetyNotes: 'Ensure the box is stable.', skillKeyword: 'Elevated Pike'
      },
      {
        id: 3, stepNumber: 3, name: 'Wall Walks & Holds', level: 'Intermediate', estimatedLevel: 4,
        description: 'Condition the shoulders for full bodyweight support.',
        whatItBuilds: 'Isometric endurance for the HSPU.',
        howTo: ['Walk up the wall chest-to-wall.', 'Hold the top position for time.'],
        sets: '4', reps: '45-60 sec hold', rest: '90 sec', progressionCriteria: '60 sec chest-to-wall hold.',
        estimatedTime: '2-3 weeks', commonMistakes: ['Sagging shoulders'], regression: 'Elevated pike holds.',
        safetyNotes: 'Breathe normally.', skillKeyword: 'Wall Hold'
      },
      {
        id: 4, stepNumber: 4, name: 'Partial ROM Wall HSPU', level: 'Intermediate', estimatedLevel: 5,
        description: 'Begin pressing your full bodyweight through a partial range of motion.',
        whatItBuilds: 'Neurological adaptation to full bodyweight pressing.',
        howTo: ['Kick up back-to-wall.', 'Lower yourself halfway down.', 'Push aggressively back up.'],
        sets: '4', reps: '3-6', rest: '120 sec', progressionCriteria: '4x6 half-reps.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Going too deep and failing'], regression: 'HSPU Negatives.',
        safetyNotes: 'Use a mat under your head.', skillKeyword: 'Partial HSPU'
      },
      {
        id: 5, stepNumber: 5, name: 'Full ROM Wall HSPU', level: 'Advanced', estimatedLevel: 6,
        description: 'A complete handstand push-up against the wall.',
        whatItBuilds: 'Elite overhead pressing strength.',
        howTo: ['Kick up back-to-wall.', 'Lower until your head lightly touches the floor.', 'Press to lockout.'],
        sets: '3-5', reps: '3-8', rest: '180 sec', progressionCriteria: '4x8 reps.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Bouncing head off the floor'], regression: 'Partial ROM HSPU.',
        safetyNotes: 'Control the descent strictly.', skillKeyword: 'Wall HSPU'
      },
      {
        id: 6, stepNumber: 6, name: 'Deficit Wall HSPU', level: 'Advanced', estimatedLevel: 7,
        description: 'Increase the range of motion past the floor using parallettes.',
        whatItBuilds: 'Extreme deep range pressing power.',
        howTo: ['Use parallettes or books.', 'Lower head past the level of your hands.', 'Press up.'],
        sets: '3-4', reps: '3-5', rest: '180 sec', progressionCriteria: '4x5 deep reps.',
        estimatedTime: '4-6 weeks', commonMistakes: ['Losing core tension at the bottom'], regression: 'Full ROM Wall HSPU.',
        safetyNotes: 'Do not strain the neck at the bottom.', skillKeyword: 'Deficit HSPU'
      },
      {
        id: 7, stepNumber: 7, name: 'Freestanding HSPU Negatives', level: 'Elite', estimatedLevel: 8,
        description: 'Learn to balance while moving through space.',
        whatItBuilds: 'Dynamic balance and eccentric strength.',
        howTo: ['Kick into a freestanding handstand.', 'Slowly lower yourself until your head touches the floor.', 'Kick down and repeat.'],
        sets: '4', reps: '3-5 negatives', rest: '120 sec', progressionCriteria: '5-second controlled negative.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Falling over immediately upon bending elbows'], regression: 'Wall HSPU.',
        safetyNotes: 'Must have a solid freestanding handstand first.', skillKeyword: 'HSPU Negative'
      },
      {
        id: 8, stepNumber: 8, name: 'Strict Freestanding HSPU', level: 'Elite', estimatedLevel: 10,
        description: 'The ultimate display of overhead pressing and balance.',
        whatItBuilds: 'Absolute mastery of the shoulders and core.',
        howTo: ['Kick into a freestanding handstand.', 'Lower to the floor while maintaining a slight tripod lean.', 'Press aggressively back to lockout.'],
        sets: '3-5', reps: '1-5', rest: '180+ sec', progressionCriteria: '5 strict reps.',
        estimatedTime: '8-16+ weeks', commonMistakes: ['Losing the tripod position'], regression: 'Negatives or Wall HSPU.',
        safetyNotes: 'Master the bail out.', skillKeyword: 'Freestanding HSPU'
      }
    ]
  },
  {
    id: 'muscle-up',
    title: 'The Strict Muscle Up',
    category: 'Muscle Up',
    description: 'Build explosive pulling power and transition technique for a strict muscle up.',
    estimatedDuration: '8-16 weeks',
    difficulty: 'Advanced',
    steps: [
      {
        id: 1, stepNumber: 1, name: '10 Clean Pull-Ups', level: 'Foundation', estimatedLevel: 2,
        description: 'The baseline pulling strength required.',
        whatItBuilds: 'Lats and biceps endurance.',
        howTo: ['Hang from bar.', 'Pull chin over bar.', 'Lower with control.'],
        sets: '3', reps: '10', rest: '90 sec', progressionCriteria: '10 strict unbroken reps.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Kipping or swinging'], regression: 'Banded pull-ups.',
        safetyNotes: 'Full range of motion is mandatory.', skillKeyword: 'Pull-Up'
      },
      {
        id: 2, stepNumber: 2, name: '15 Straight Bar Dips', level: 'Foundation', estimatedLevel: 3,
        description: 'The pushing strength needed once over the bar.',
        whatItBuilds: 'Triceps and lower chest.',
        howTo: ['Jump up to support on a straight bar.', 'Lower until chest touches bar.', 'Press to lockout.'],
        sets: '3', reps: '12-15', rest: '90 sec', progressionCriteria: '15 unbroken reps.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Not going deep enough'], regression: 'Parallel bar dips.',
        safetyNotes: 'Keep elbows close to body.', skillKeyword: 'Straight Bar Dip'
      },
      {
        id: 3, stepNumber: 3, name: 'High Pull-Ups (To Chest)', level: 'Intermediate', estimatedLevel: 4,
        description: 'Develop explosive pulling power.',
        whatItBuilds: 'Fast-twitch muscle fibers in the lats.',
        howTo: ['Pull explosively.', 'Aim to touch the bar to your lower chest.'],
        sets: '4', reps: '4-6', rest: '120 sec', progressionCriteria: 'Consistent pulls to lower chest.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Pulling slowly'], regression: 'Weighted pull-ups.',
        safetyNotes: 'Control the eccentric.', skillKeyword: 'High Pull-Up'
      },
      {
        id: 4, stepNumber: 4, name: 'Explosive Pull-Ups (To Waist)', level: 'Advanced', estimatedLevel: 5,
        description: 'Extreme explosive pulling to make the transition effortless.',
        whatItBuilds: 'Elite explosive power.',
        howTo: ['Pull as hard and fast as possible.', 'Aim to pull the bar to your belly button/waist.'],
        sets: '5', reps: '3-5', rest: '180 sec', progressionCriteria: 'Can pull bar to waist.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Piking the legs to cheat height'], regression: 'High Pull-ups.',
        safetyNotes: 'Rest adequately between sets.', skillKeyword: 'Explosive Pull-Up'
      },
      {
        id: 5, stepNumber: 5, name: 'Jumping Muscle Up', level: 'Advanced', estimatedLevel: 6,
        description: 'Learn the transition mechanics using leg momentum.',
        whatItBuilds: 'Neuromuscular coordination for the transition.',
        howTo: ['Stand on a box under a low bar.', 'Jump and pull simultaneously.', 'Throw chest over the bar and press.'],
        sets: '4', reps: '3-5', rest: '120 sec', progressionCriteria: 'Smooth transition without pausing.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Chicken winging (one arm at a time)'], regression: 'Explosive pull-ups.',
        safetyNotes: 'Do NOT chicken wing, it destroys the rotator cuff.', skillKeyword: 'Jumping Muscle Up'
      },
      {
        id: 6, stepNumber: 6, name: 'Banded Muscle Up', level: 'Elite', estimatedLevel: 7,
        description: 'Perform the full movement with slight assistance.',
        whatItBuilds: 'Timing and technique.',
        howTo: ['Loop a resistance band around the bar and your feet.', 'Perform a strict muscle up.'],
        sets: '4', reps: '2-4', rest: '180 sec', progressionCriteria: 'Can do 3 reps with a light band.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Relying entirely on the band bounce'], regression: 'Jumping muscle up.',
        safetyNotes: 'Ensure the band is securely fastened.', skillKeyword: 'Banded Muscle Up'
      },
      {
        id: 7, stepNumber: 7, name: 'Strict Muscle Up', level: 'Elite', estimatedLevel: 8,
        description: 'The holy grail pulling skill.',
        whatItBuilds: 'Ultimate upper body pulling and transition mastery.',
        howTo: ['Start from a dead hang (false grip optional).', 'Pull explosively.', 'Snap chest over the bar.', 'Press out.'],
        sets: '3-5', reps: '1-3', rest: '3+ min', progressionCriteria: '3 strict consecutive reps.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Losing false grip', 'Pulling too early'], regression: 'Banded muscle up.',
        safetyNotes: 'Celebrate your achievement safely.', skillKeyword: 'Strict Muscle Up'
      }
    ]
  },
  {
    id: 'planche',
    title: 'Planche Fundamentals',
    category: 'Planche',
    description: 'Develop extreme straight-arm and shoulder strength to achieve the gravity-defying Planche.',
    estimatedDuration: '6-18+ months',
    difficulty: 'Elite',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Planche Lean', level: 'Foundation', estimatedLevel: 3,
        description: 'Condition the biceps tendons and anterior deltoids for straight-arm pressure.',
        whatItBuilds: 'Straight-arm conditioning and scapular protraction.',
        howTo: ['Assume a push-up position.', 'Lock elbows and protract scapula (round upper back).', 'Lean forward over your hands as far as possible.'],
        sets: '4', reps: '15-20 sec', rest: '90 sec', progressionCriteria: '20s lean with hands at waist level.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Bending the elbows', 'Retracting scapula'], regression: 'Standard plank.',
        safetyNotes: 'Biceps tendon conditioning takes time. Do not rush.', skillKeyword: 'Planche Lean'
      },
      {
        id: 2, stepNumber: 2, name: 'Pseudo Planche Push-Ups', level: 'Intermediate', estimatedLevel: 4,
        description: 'Build dynamic pressing strength in a planche-like position.',
        whatItBuilds: 'Anterior deltoid hypertrophy and pressing power.',
        howTo: ['Get into a deep planche lean.', 'Perform a push-up while maintaining the forward lean.', 'Protract at the top.'],
        sets: '4', reps: '6-10', rest: '120 sec', progressionCriteria: '4x10 deep reps.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Shifting weight back during the push'], regression: 'Planche lean holds.',
        safetyNotes: 'Keep elbows tucked.', skillKeyword: 'Pseudo Planche Push-Up'
      },
      {
        id: 3, stepNumber: 3, name: 'Frog Stand', level: 'Intermediate', estimatedLevel: 5,
        description: 'Learn to balance your bodyweight on your hands.',
        whatItBuilds: 'Wrist strength and balance.',
        howTo: ['Squat down, place hands on floor.', 'Rest knees on your elbows/triceps.', 'Lean forward until feet float.'],
        sets: '4', reps: '30-45 sec', rest: '90 sec', progressionCriteria: '45 sec hold.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Jumping into it instead of leaning'], regression: 'Planche leans.',
        safetyNotes: 'Place a pillow in front of your face.', skillKeyword: 'Frog Stand'
      },
      {
        id: 4, stepNumber: 4, name: 'Tuck Planche', level: 'Advanced', estimatedLevel: 6,
        description: 'The first true straight-arm planche progression.',
        whatItBuilds: 'Massive shoulder and core compression strength.',
        howTo: ['Place hands on floor or parallettes.', 'Tuck knees to chest.', 'Lock arms, protract, and lean until feet lift without resting on elbows.'],
        sets: '5', reps: '10-20 sec', rest: '120 sec', progressionCriteria: '20 sec solid hold with straight arms.',
        estimatedTime: '6-12 weeks', commonMistakes: ['Micro-bend in elbows'], regression: 'Frog stand.',
        safetyNotes: 'Straight arms are non-negotiable.', skillKeyword: 'Tuck Planche'
      },
      {
        id: 5, stepNumber: 5, name: 'Advanced Tuck Planche', level: 'Elite', estimatedLevel: 7,
        description: 'Flatten the back to dramatically increase the lever arm.',
        whatItBuilds: 'Extreme shoulder torque and lower back strength.',
        howTo: ['From a tuck planche, extend the hips back until the back is flat.', 'Keep knees bent 90 degrees.'],
        sets: '5', reps: '10-15 sec', rest: '180 sec', progressionCriteria: '15 sec flat back hold.',
        estimatedTime: '8-16 weeks', commonMistakes: ['Piking the hips up to cheat'], regression: 'Tuck planche.',
        safetyNotes: 'Very intense on the lower back and shoulders.', skillKeyword: 'Advanced Tuck Planche'
      },
      {
        id: 6, stepNumber: 6, name: 'Straddle Planche', level: 'Elite', estimatedLevel: 9,
        description: 'Extend the legs into a straddle, opening the hips fully.',
        whatItBuilds: 'World-class isometric strength.',
        howTo: ['From advanced tuck, extend legs wide into a straddle.', 'Maintain full protraction and straight arms.'],
        sets: '5-8', reps: '5-10 sec', rest: '180+ sec', progressionCriteria: '10 sec solid hold.',
        estimatedTime: '12-24+ weeks', commonMistakes: ['Bending elbows', 'Arching lower back'], regression: 'Advanced Tuck Planche.',
        safetyNotes: 'Requires excellent hip mobility.', skillKeyword: 'Straddle Planche'
      },
      {
        id: 7, stepNumber: 7, name: 'Full Planche', level: 'Elite', estimatedLevel: 10,
        description: 'The ultimate display of static calisthenics strength.',
        whatItBuilds: 'Gravity defiance.',
        howTo: ['Bring legs together from the straddle.', 'Hold your entire body horizontal to the ground on straight arms.'],
        sets: '5', reps: '3-8 sec', rest: '3+ min', progressionCriteria: '5 sec perfect hold.',
        estimatedTime: '1-2+ years', commonMistakes: ['Any break in form'], regression: 'Straddle planche.',
        safetyNotes: 'Legendary skill, respect the journey.', skillKeyword: 'Full Planche'
      }
    ]
  },
  {
    id: 'front-lever',
    title: 'Front Lever Mastery',
    category: 'Front Lever',
    description: 'Develop a forged iron back and elite lat strength.',
    estimatedDuration: '4-12 months',
    difficulty: 'Advanced to Elite',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Hollow Body Hold', level: 'Beginner', estimatedLevel: 1,
        description: 'Learn the body line required for the front lever.',
        whatItBuilds: 'Core tension.',
        howTo: ['Lie on floor, press lower back down.', 'Lift legs and shoulders.'],
        sets: '3', reps: '60 sec', rest: '60 sec', progressionCriteria: '60 sec hold.',
        estimatedTime: '1-2 weeks', commonMistakes: ['Arching lower back'], regression: 'Bent knee hollow hold.',
        safetyNotes: 'Breathe normally.', skillKeyword: 'Hollow Body Hold'
      },
      {
        id: 2, stepNumber: 2, name: 'Active Hangs & Scap Pulls', level: 'Foundation', estimatedLevel: 2,
        description: 'Learn to engage the lats and retract/depress the scapula.',
        whatItBuilds: 'Scapular control.',
        howTo: ['Hang from bar.', 'Keep arms straight and pull shoulders down and back.'],
        sets: '3', reps: '10-15 reps', rest: '90 sec', progressionCriteria: '3x15 reps.',
        estimatedTime: '2-3 weeks', commonMistakes: ['Bending elbows'], regression: 'Dead hangs.',
        safetyNotes: 'Focus on mind-muscle connection.', skillKeyword: 'Scap Pull'
      },
      {
        id: 3, stepNumber: 3, name: 'Tuck Front Lever', level: 'Intermediate', estimatedLevel: 4,
        description: 'The first static horizontal hold.',
        whatItBuilds: 'Lat isometric strength.',
        howTo: ['Hang from bar, tuck knees to chest.', 'Engage lats and lean back until torso is horizontal.'],
        sets: '4', reps: '20-30 sec', rest: '120 sec', progressionCriteria: '30 sec hold.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Looking at the ceiling instead of toes'], regression: 'Scap pulls.',
        safetyNotes: 'Keep arms completely locked.', skillKeyword: 'Tuck Front Lever'
      },
      {
        id: 4, stepNumber: 4, name: 'Advanced Tuck Front Lever', level: 'Advanced', estimatedLevel: 6,
        description: 'Flatten the back to increase leverage difficulty.',
        whatItBuilds: 'Intense lat and core strength.',
        howTo: ['From tuck, extend hips until back is flat.', 'Keep knees bent 90 degrees.'],
        sets: '4', reps: '15-20 sec', rest: '120 sec', progressionCriteria: '20 sec flat back hold.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Piking hips up'], regression: 'Tuck front lever.',
        safetyNotes: 'Do not drop the hips.', skillKeyword: 'Advanced Tuck Front Lever'
      },
      {
        id: 5, stepNumber: 5, name: 'Straddle Front Lever', level: 'Elite', estimatedLevel: 8,
        description: 'Extend the legs wide to approach the full lever.',
        whatItBuilds: 'Elite straight-arm pulling strength.',
        howTo: ['Extend legs into a wide straddle from advanced tuck.', 'Keep body perfectly horizontal.'],
        sets: '5', reps: '10-15 sec', rest: '180 sec', progressionCriteria: '15 sec hold.',
        estimatedTime: '8-16 weeks', commonMistakes: ['Bending arms'], regression: 'One-Leg Front Lever.',
        safetyNotes: 'Ensure thorough warm-up of lats and elbows.', skillKeyword: 'Straddle Front Lever'
      },
      {
        id: 6, stepNumber: 6, name: 'Full Front Lever', level: 'Elite', estimatedLevel: 10,
        description: 'A completely straight horizontal bodyweight hold.',
        whatItBuilds: 'Mastery of bodyweight pulling.',
        howTo: ['Bring legs together.', 'Point toes, squeeze glutes, lock arms.', 'Hold horizontal.'],
        sets: '5', reps: '5-10 sec', rest: '3+ min', progressionCriteria: '10 sec perfect hold.',
        estimatedTime: '12-24 weeks', commonMistakes: ['Piking at hips'], regression: 'Straddle Front Lever.',
        safetyNotes: 'Celebrate your achievement.', skillKeyword: 'Full Front Lever'
      }
    ]
  },
  {
    id: 'l-sit',
    title: 'L-Sit Mastery',
    category: 'Core',
    description: 'Build intense compression strength and tricep depression for gymnastics-level core skills.',
    estimatedDuration: '4-10 weeks',
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Seated Leg Lifts', level: 'Beginner', estimatedLevel: 1,
        description: 'Condition the hip flexors and quads for compression.',
        whatItBuilds: 'Active flexibility in the hamstrings and hip flexors.',
        howTo: ['Sit on the floor, legs straight.', 'Place hands by your knees.', 'Lift legs off the floor, keeping them straight.'],
        sets: '3', reps: '10-15 reps', rest: '60 sec', progressionCriteria: '3x15 reps without leaning back.',
        estimatedTime: '1-3 weeks', commonMistakes: ['Leaning back', 'Bending knees'], regression: 'One leg at a time.',
        safetyNotes: 'Cramping in the quads is normal initially.', skillKeyword: 'Leg Lifts'
      },
      {
        id: 2, stepNumber: 2, name: 'Tuck Support', level: 'Foundation', estimatedLevel: 2,
        description: 'Learn to support your bodyweight on your hands with depressed shoulders.',
        whatItBuilds: 'Triceps and scapular depression.',
        howTo: ['Place hands on floor or parallettes.', 'Push down to lift your body.', 'Tuck knees to chest.'],
        sets: '3', reps: '30-45 sec', rest: '90 sec', progressionCriteria: '45 sec hold.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Shrugging shoulders up to ears'], regression: 'Foot supported hold.',
        safetyNotes: 'Actively push the floor down.', skillKeyword: 'Tuck Support'
      },
      {
        id: 3, stepNumber: 3, name: 'One-Leg Extended L-Sit', level: 'Intermediate', estimatedLevel: 3,
        description: 'Bridge the gap to the full L-Sit.',
        whatItBuilds: 'Unilateral core compression.',
        howTo: ['From a tuck support, extend one leg perfectly straight.', 'Keep the other tucked.', 'Alternate sides.'],
        sets: '4', reps: '15-20 sec per leg', rest: '90 sec', progressionCriteria: '20 sec per leg.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Bending the extended knee'], regression: 'Tuck support.',
        safetyNotes: 'Keep chest proud.', skillKeyword: 'One-Leg L-Sit'
      },
      {
        id: 4, stepNumber: 4, name: 'Full L-Sit', level: 'Advanced', estimatedLevel: 5,
        description: 'The standard gymnastics L-Sit.',
        whatItBuilds: 'Exceptional core and tricep isometric strength.',
        howTo: ['From support, extend both legs straight out.', 'Keep legs parallel to the floor.', 'Point toes and lock knees.'],
        sets: '4', reps: '15-30 sec', rest: '120 sec', progressionCriteria: '30 sec perfect hold on floor.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Dropping legs below parallel', 'Bending knees'], regression: 'One-Leg L-Sit.',
        safetyNotes: 'Do not hold your breath.', skillKeyword: 'Full L-Sit'
      }
    ]
  },
  {
    id: 'v-sit',
    title: 'V-Sit Mastery',
    category: 'Core',
    description: 'Take your L-Sit to the next level with extreme active compression.',
    estimatedDuration: '8-16 weeks',
    difficulty: 'Elite',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Solid L-Sit', level: 'Foundation', estimatedLevel: 5,
        description: 'You must have a flawless L-Sit before attempting the V-Sit.',
        whatItBuilds: 'Baseline core strength.',
        howTo: ['Hold a perfect L-Sit on the floor.'],
        sets: '3', reps: '30 sec', rest: '120 sec', progressionCriteria: '3x30 sec L-Sit.',
        estimatedTime: 'N/A', commonMistakes: ['Proceeding before ready'], regression: 'L-Sit Roadmap.',
        safetyNotes: 'Master the L-Sit first.', skillKeyword: 'L-Sit'
      },
      {
        id: 2, stepNumber: 2, name: 'Pike Stretch / Pancake', level: 'Intermediate', estimatedLevel: 6,
        description: 'Passive flexibility required for the V-shape.',
        whatItBuilds: 'Hamstring and lower back flexibility.',
        howTo: ['Sit with legs straight.', 'Reach for your toes.', 'Aim to put chest on knees.'],
        sets: '3', reps: '60 sec', rest: '60 sec', progressionCriteria: 'Chest flat against knees.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Rounding upper back instead of hinging hips'], regression: 'Banded stretch.',
        safetyNotes: 'Stretch when warm.', skillKeyword: 'Pike Stretch'
      },
      {
        id: 3, stepNumber: 3, name: 'High L-Sit', level: 'Advanced', estimatedLevel: 7,
        description: 'Push the hips slightly forward and raise legs above parallel.',
        whatItBuilds: 'Increased compression.',
        howTo: ['From L-Sit, lean shoulders slightly back.', 'Actively pull toes higher than hips.'],
        sets: '4', reps: '15-20 sec', rest: '120 sec', progressionCriteria: '20 sec high L-Sit.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Bending knees to gain height'], regression: 'L-Sit.',
        safetyNotes: 'Intense hip flexor activation.', skillKeyword: 'High L-Sit'
      },
      {
        id: 4, stepNumber: 4, name: 'Tuck V-Sit', level: 'Advanced', estimatedLevel: 8,
        description: 'Learn the aggressive backward lean and hip push.',
        whatItBuilds: 'Balance for the V-Sit.',
        howTo: ['Support on hands, push hips far forward between hands.', 'Tuck knees high into chest.'],
        sets: '4', reps: '15-20 sec', rest: '120 sec', progressionCriteria: '20 sec hold.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Not pushing hips forward enough'], regression: 'High L-Sit.',
        safetyNotes: 'Balance is tricky, be prepared to catch yourself.', skillKeyword: 'Tuck V-Sit'
      },
      {
        id: 5, stepNumber: 5, name: 'Full V-Sit', level: 'Elite', estimatedLevel: 10,
        description: 'The ultimate compression hold.',
        whatItBuilds: 'Elite gymnastics compression.',
        howTo: ['Push hips forward, lean back, and extend legs completely.', 'Aim for feet to be face height or higher.', 'Lock knees, point toes.'],
        sets: '4', reps: '5-15 sec', rest: '180 sec', progressionCriteria: '10 sec high V-Sit.',
        estimatedTime: '8-16+ weeks', commonMistakes: ['Bent knees', 'Not pushing hips forward'], regression: 'Tuck V-Sit.',
        safetyNotes: 'Tremendous strain on triceps and core.', skillKeyword: 'V-Sit'
      }
    ]
  },
  {
    id: 'one-arm-handstand',
    title: 'One Arm Handstand',
    category: 'Handstand',
    description: 'The pinnacle of hand-balancing. Requires immense patience, alignment, and fingertip control.',
    estimatedDuration: '1-3+ years',
    difficulty: 'Elite',
    steps: [
      {
        id: 1, stepNumber: 1, name: '60s Freestanding Handstand', level: 'Foundation', estimatedLevel: 7,
        description: 'Non-negotiable prerequisite.',
        whatItBuilds: 'Baseline balance.',
        howTo: ['Hold a perfect straight-line handstand.'],
        sets: '3', reps: '60 sec', rest: '120 sec', progressionCriteria: 'Consistent 60s hold.',
        estimatedTime: 'Months', commonMistakes: ['Moving around too much'], regression: 'Wall holds.',
        safetyNotes: 'Do not proceed if you cannot do this.', skillKeyword: 'Freestanding Handstand'
      },
      {
        id: 2, stepNumber: 2, name: 'Weight Shifting (Wall)', level: 'Advanced', estimatedLevel: 8,
        description: 'Learn to shift your center of gravity over one arm.',
        whatItBuilds: 'Understanding of the flag position.',
        howTo: ['Kick up chest-to-wall.', 'Shift hips and shoulders over the right arm.', 'Make the left hand light.'],
        sets: '4', reps: '10 shifts per side', rest: '120 sec', progressionCriteria: 'Comfortable weight transfer.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Bending the supporting elbow'], regression: 'Two arm handstand.',
        safetyNotes: 'Keep the supporting arm completely locked.', skillKeyword: 'Weight Shifting'
      },
      {
        id: 3, stepNumber: 3, name: 'Fingertip Assisted OAHS', level: 'Elite', estimatedLevel: 9,
        description: 'Balance primarily on one arm, using fingers of the other hand for support.',
        whatItBuilds: 'One arm alignment.',
        howTo: ['Shift weight over the right arm.', 'Come up onto the fingertips of the left hand.', 'Gradually remove fingers (5 -> 3 -> 1).'],
        sets: '5', reps: '10-20 sec holds', rest: '120 sec', progressionCriteria: '20s hold on one finger.',
        estimatedTime: '3-6 months', commonMistakes: ['Losing tension in the free arm shoulder'], regression: 'Weight shifting.',
        safetyNotes: 'Do this straddled initially for better balance.', skillKeyword: 'Assisted One Arm Handstand'
      },
      {
        id: 4, stepNumber: 4, name: 'Full One Arm Handstand (OAHS)', level: 'Elite', estimatedLevel: 10,
        description: 'The holy grail of balancing.',
        whatItBuilds: 'Circus-level balance.',
        howTo: ['Shift weight perfectly.', 'Remove the assisting hand entirely.', 'Use fingers of the supporting hand to balance.'],
        sets: 'Many', reps: '3-10 sec', rest: 'As needed', progressionCriteria: '5-10 sec consistent hold.',
        estimatedTime: 'Years', commonMistakes: ['Losing elevation in the supporting shoulder'], regression: 'Fingertip assist.',
        safetyNotes: 'Protect your wrists.', skillKeyword: 'One Arm Handstand'
      }
    ]
  },
  {
    id: 'human-flag',
    title: 'Human Flag Mastery',
    category: 'Calisthenics',
    description: 'Build unbelievable oblique, lat, and shoulder strength to hold your body sideways.',
    estimatedDuration: '8-20 weeks',
    difficulty: 'Advanced',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Support Press (Vertical Flag)', level: 'Foundation', estimatedLevel: 4,
        description: 'Learn the push-pull mechanics on a vertical pole.',
        whatItBuilds: 'Bottom arm pushing strength, top arm pulling strength.',
        howTo: ['Grab a vertical pole.', 'Bottom hand pushes aggressively, top hand pulls.', 'Jump up and hold your body vertical against the pole.'],
        sets: '4', reps: '15-20 sec', rest: '90 sec', progressionCriteria: '20 sec solid hold.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Bending bottom arm'], regression: 'Hanging holds.',
        safetyNotes: 'Lock the bottom elbow.', skillKeyword: 'Support Press'
      },
      {
        id: 2, stepNumber: 2, name: 'Tuck Human Flag', level: 'Intermediate', estimatedLevel: 6,
        description: 'First horizontal flag progression.',
        whatItBuilds: 'Oblique and lateral core strength.',
        howTo: ['From vertical support, tuck knees to chest.', 'Lower body until horizontal.'],
        sets: '4', reps: '10-15 sec', rest: '120 sec', progressionCriteria: '15 sec hold.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Dropping hips'], regression: 'Support press.',
        safetyNotes: 'Intense on the shoulders.', skillKeyword: 'Tuck Flag'
      },
      {
        id: 3, stepNumber: 3, name: 'Straddle Human Flag', level: 'Advanced', estimatedLevel: 8,
        description: 'Extend the legs wide to increase the lever arm.',
        whatItBuilds: 'Extreme lateral tension.',
        howTo: ['From tuck, extend legs into a wide straddle.', 'Keep chest facing forward/slightly up.'],
        sets: '4', reps: '5-10 sec', rest: '180 sec', progressionCriteria: '10 sec hold.',
        estimatedTime: '4-8 weeks', commonMistakes: ['Twisting the torso downward'], regression: 'Advanced Tuck Flag.',
        safetyNotes: 'Maintain tension.', skillKeyword: 'Straddle Flag'
      },
      {
        id: 4, stepNumber: 4, name: 'Full Human Flag', level: 'Elite', estimatedLevel: 9,
        description: 'The iconic sideways hold.',
        whatItBuilds: 'Peak lateral core and shoulder power.',
        howTo: ['Bring legs together from straddle.', 'Lock entire body horizontally.', 'Point toes and squeeze glutes.'],
        sets: '4', reps: '3-8 sec', rest: '3+ min', progressionCriteria: '5 sec perfect hold.',
        estimatedTime: '6-12 weeks', commonMistakes: ['Sagging at the hips'], regression: 'Straddle Flag.',
        safetyNotes: 'Train both sides to prevent imbalances.', skillKeyword: 'Full Human Flag'
      }
    ]
  },
  {
    id: 'pistol-squat',
    title: 'Pistol Squat Mastery',
    category: 'Mobility',
    description: 'Unlock elite unilateral leg strength and deep ankle mobility.',
    estimatedDuration: '4-12 weeks',
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1, stepNumber: 1, name: 'Cossack Squats', level: 'Beginner', estimatedLevel: 1,
        description: 'Open the hips and build lateral strength.',
        whatItBuilds: 'Hip mobility and adductor flexibility.',
        howTo: ['Wide stance.', 'Squat deep onto one leg, keeping the other straight.', 'Keep heel of squatting leg on floor.'],
        sets: '3', reps: '8-10 per leg', rest: '60 sec', progressionCriteria: '10 deep reps per side.',
        estimatedTime: '1-3 weeks', commonMistakes: ['Heel lifting off floor'], regression: 'Standard squats.',
        safetyNotes: 'Do not force the depth.', skillKeyword: 'Cossack Squat'
      },
      {
        id: 2, stepNumber: 2, name: 'Assisted Pistol Squats', level: 'Foundation', estimatedLevel: 3,
        description: 'Learn the movement pattern while holding a support.',
        whatItBuilds: 'Balance and neurological adaptation.',
        howTo: ['Hold a doorframe or TRX bands.', 'Squat down on one leg.', 'Use arms slightly to help push back up.'],
        sets: '3', reps: '5-8 per leg', rest: '90 sec', progressionCriteria: '8 reps with minimal arm assistance.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Relying entirely on arms'], regression: 'Box step-ups.',
        safetyNotes: 'Keep the knee tracking over the toes.', skillKeyword: 'Assisted Pistol'
      },
      {
        id: 3, stepNumber: 3, name: 'Box Pistol Squats', level: 'Intermediate', estimatedLevel: 4,
        description: 'Remove arm assistance and control the eccentric.',
        whatItBuilds: 'Unilateral quad strength.',
        howTo: ['Stand on one leg in front of a chair/box.', 'Squat down until glutes touch the box.', 'Stand back up.'],
        sets: '4', reps: '5-8 per leg', rest: '90 sec', progressionCriteria: '8 reps on a low box.',
        estimatedTime: '2-4 weeks', commonMistakes: ['Plunking down onto the box'], regression: 'Assisted pistols.',
        safetyNotes: 'Control the descent.', skillKeyword: 'Box Pistol'
      },
      {
        id: 4, stepNumber: 4, name: 'Full Pistol Squat', level: 'Advanced', estimatedLevel: 6,
        description: 'The full unassisted bodyweight single-leg squat.',
        whatItBuilds: 'Elite leg strength and ankle mobility.',
        howTo: ['Stand on one leg, extend other leg forward.', 'Squat deep until hamstring rests on calf.', 'Drive up powerfully.'],
        sets: '4', reps: '3-6 per leg', rest: '120 sec', progressionCriteria: '5 strict reps per leg.',
        estimatedTime: '3-6 weeks', commonMistakes: ['Heel lifting (requires ankle mobility work)', 'Rounding back excessively'], regression: 'Box pistols.',
        safetyNotes: 'Warm up knees and ankles thoroughly.', skillKeyword: 'Full Pistol Squat'
      }
    ]
  }
];
