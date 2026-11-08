/**
 * @module models/challenge.model
 * @description Mongoose schema/model for fitness challenges.
 *
 * Fields (planned):
 *  - title, description, banner (Cloudinary URL)
 *  - creator (ref: User)
 *  - startDate, endDate
 *  - type: 'steps' | 'calories' | 'workout-streak' | 'custom'
 *  - goal (numeric target)
 *  - participants: [{ user, progress, joinedAt }]
 *  - leaderboard (virtual or cached)
 *  - timestamps
 */

// ─── Placeholder ──────────────────────────────────────────────────────────────
