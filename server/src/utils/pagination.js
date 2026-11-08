/**
 * @module utils/pagination
 * @description Mongoose query pagination helper.
 */

/**
 * Paginate a Mongoose query.
 * @param {Model}  model   - Mongoose model
 * @param {object} filter  - MongoDB filter object
 * @param {object} options - { page, limit, sort, select, populate }
 * @returns {Promise<{docs, total, page, limit, totalPages, hasNextPage, hasPrevPage}>}
 */
export const paginate = async (model, filter = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;

  let query = model.find(filter).skip(skip).limit(limit);

  if (options.sort) query = query.sort(options.sort);
  if (options.select) query = query.select(options.select);
  if (options.populate) query = query.populate(options.populate);

  const [docs, total] = await Promise.all([query.exec(), model.countDocuments(filter)]);

  const totalPages = Math.ceil(total / limit);

  return {
    docs,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getPaginatedResults = paginate;
