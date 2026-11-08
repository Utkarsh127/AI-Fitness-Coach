/**
 * @module models/nutritionPlan.model
 * @description Mongoose schema/model for nutrition/meal plans.
 *
 * Fields (planned):
 *  - user (ref: User)
 *  - title, goal
 *  - dailyCalorieTarget, macros: { protein, carbs, fat }
 *  - meals: [{ name, time, foods: [{ item, calories, qty }] }]
 *  - isAiGenerated
 *  - timestamps
 */

// ─── Placeholder ──────────────────────────────────────────────────────────────
