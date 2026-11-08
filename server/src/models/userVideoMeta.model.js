/**
 * @module models/userVideoMeta.model
 * @description Mongoose schema to track user's video favorites, watch later, and history.
 */

import mongoose from 'mongoose';

const userVideoMetaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }],
    watchLater: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }],
    history: [{
      video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
      watchedAt: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserVideoMeta = mongoose.model('UserVideoMeta', userVideoMetaSchema);
export default UserVideoMeta;
