/**
 * @module modules/community/community.service
 * @description Business logic for Community feed, posts, and interactions.
 */

import Post from '../../models/post.model.js';
import Comment from '../../models/comment.model.js';
import ApiError from '../../utils/ApiError.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import { createNotification } from '../notifications/notification.service.js';
import cloudinary from '../../config/cloudinary.js';

// ─── Posts ───────────────────────────────────────────────────────────────────

export const getFeed = async (userId, query) => {
  const { page = 1, limit = 10, search, postType, tag } = query;
  
  // Base filter: Only public posts, or posts by the user themselves
  // (In the future: add logic for Followers visibility)
  const filter = {
    isDeleted: false,
    $or: [{ visibility: 'Public' }, { author: userId }]
  };

  if (search) {
    filter.$text = { $search: search };
  }
  if (postType) {
    filter.postType = postType;
  }
  if (tag) {
    filter.tags = { $in: [tag.toLowerCase()] };
  }

  // Define populate fields
  const populate = [
    { path: 'author', select: 'name username profilePicture' },
    { path: 'workoutReference', select: 'duration totalVolume date' },
    { path: 'progressReference', select: 'recordType value exercise', populate: { path: 'exercise', select: 'name' } }
  ];

  return getPaginatedResults(Post, filter, { page, limit, sort: { createdAt: -1 }, populate });
};

export const getPostById = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false })
    .populate('author', 'name username profilePicture')
    .populate('workoutReference', 'duration totalVolume date')
    .populate('progressReference', 'recordType value exercise')
    .populate({
      path: 'progressReference.exercise',
      select: 'name'
    });

  if (!post) throw new ApiError(404, 'Post not found');
  
  if (post.visibility === 'Private' && post.author._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'You do not have permission to view this post');
  }

  return post;
};

export const createPost = async (userId, data, files = []) => {
  if (!data.caption && files.length === 0 && !data.workoutReference && !data.progressReference) {
    throw new ApiError(400, 'Post must contain a caption, media, or an achievement reference');
  }

  // Handle uploaded images (populated by multer-storage-cloudinary)
  const images = files.map(file => file.path);

  const post = await Post.create({
    ...data,
    author: userId,
    images
  });

  return Post.findById(post._id)
    .populate('author', 'name username profilePicture')
    .populate('workoutReference')
    .populate('progressReference');
};

export const updatePost = async (postId, userId, data) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only edit your own posts');
  }

  Object.assign(post, data);
  post.isEdited = true;
  await post.save();

  return Post.findById(post._id).populate('author', 'name username profilePicture');
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own posts');
  }

  post.isDeleted = true;
  await post.save();

  // Background Cloudinary cleanup
  if (post.images && post.images.length > 0) {
    post.images.forEach(imgUrl => {
      try {
        const parts = imgUrl.split('/upload/');
        if (parts.length === 2) {
          const pathWithoutVersion = parts[1].replace(/^v\d+\//, '');
          const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')) || pathWithoutVersion;
          if (publicId) {
            cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary delete error:', err));
          }
        }
      } catch (err) {
        console.error('Error parsing Cloudinary URL:', err);
      }
    });
  }
};

// ─── Interactions (Likes & Bookmarks) ────────────────────────────────────────

export const toggleLikePost = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(404, 'Post not found');

  const hasLiked = post.likes.includes(userId);
  if (hasLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
    
    // Notification for like
    if (post.author.toString() !== userId.toString()) {
      await createNotification({
        recipient: post.author,
        sender: userId,
        type: 'Like',
        title: 'New Like',
        message: 'liked your post.',
        actionUrl: `/community/post/${postId}`,
        entityType: 'Post',
        entityId: postId
      }).catch(err => console.error('Notification error:', err));
    }
  }
  
  await post.save();
  return post.likes;
};

export const toggleBookmarkPost = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(404, 'Post not found');

  const index = post.bookmarks.indexOf(userId);
  if (index === -1) {
    post.bookmarks.push(userId); // Bookmark
  } else {
    post.bookmarks.splice(index, 1); // Remove Bookmark
  }
  
  await post.save();
  return post.bookmarks;
};

export const getSavedPosts = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const filter = { bookmarks: userId, isDeleted: false };
  const populate = { path: 'author', select: 'name username profilePicture' };
  
  return getPaginatedResults(Post, filter, { page, limit, sort: { createdAt: -1 }, populate });
};

export const getUserPosts = async (targetUserId, query) => {
  const { page = 1, limit = 10 } = query;
  const filter = { author: targetUserId, isDeleted: false, visibility: 'Public' }; // simplified visibility check
  const populate = { path: 'author', select: 'name username profilePicture' };
  
  return getPaginatedResults(Post, filter, { page, limit, sort: { createdAt: -1 }, populate });
};

// ─── Comments ────────────────────────────────────────────────────────────────

export const addComment = async (postId, userId, data) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(404, 'Post not found');

  const parentCommentId = data.parentComment;

  // Verify parent comment exists if replying
  if (parentCommentId) {
    const parent = await Comment.findOne({ _id: parentCommentId, post: postId, isDeleted: false });
    if (!parent) throw new ApiError(404, 'Parent comment not found');
    
    // Optional: Enforce 1-level nesting by setting the parent to the parent's parent if it's already a reply
    if (parent.parentComment) {
      data.parentComment = parent.parentComment;
    }
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    message: data.message,
    parentComment: data.parentComment || null
  });

  // Increment post comment count
  post.commentsCount += 1;
  await post.save();

  // Populate sender info for return and notification
  await comment.populate('author', 'name username profilePicture');

  // Trigger Notification
  if (parentCommentId) {
    // Notify parent comment author
    const parentComment = await Comment.findById(parentCommentId);
    if (parentComment && parentComment.author.toString() !== userId.toString()) {
      await createNotification({
        recipient: parentComment.author,
        sender: userId,
        type: 'Reply',
        title: 'New Reply',
        message: 'replied to your comment.',
        actionUrl: `/community/post/${postId}`,
        entityType: 'Comment',
        entityId: comment._id
      }).catch(err => console.error(err));
    }
  } else if (post.author.toString() !== userId.toString()) {
    // Notify post author
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: 'Comment',
      title: 'New Comment',
      message: 'commented on your post.',
      actionUrl: `/community/post/${postId}`,
      entityType: 'Post',
      entityId: postId
    }).catch(err => console.error(err));
  }

  return comment;
};

export const getCommentsForPost = async (postId) => {
  // Fetch top-level comments
  const comments = await Comment.find({ post: postId, parentComment: null, isDeleted: false })
    .populate('author', 'name username profilePicture')
    .sort({ createdAt: -1 });

  // Fetch replies
  const replies = await Comment.find({ post: postId, parentComment: { $ne: null }, isDeleted: false })
    .populate('author', 'name username profilePicture')
    .sort({ createdAt: 1 });

  // Group replies by parent
  const groupedReplies = replies.reduce((acc, reply) => {
    const parentId = reply.parentComment.toString();
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(reply);
    return acc;
  }, {});

  // Attach replies to top-level comments
  return comments.map(comment => {
    const commentObj = comment.toJSON();
    commentObj.replies = groupedReplies[comment._id.toString()] || [];
    return commentObj;
  });
};

export const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own comments');
  }

  comment.isDeleted = true;
  await comment.save();

  // Decrement post comment count
  const post = await Post.findById(comment.post);
  if (post) {
    post.commentsCount = Math.max(0, post.commentsCount - 1);
    await post.save();
  }
};
