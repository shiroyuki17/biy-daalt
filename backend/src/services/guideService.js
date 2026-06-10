const db = require('../config/db');
const { getCache, setCache, deleteCache } = require('../cache/redis');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const getAllGuides = async () => {
  const cacheKey = 'guides:list';

  const cachedGuides = await getCache(cacheKey);
  if (cachedGuides) {
    logger.info('Cache hit for guides list');
    return cachedGuides;
  }

  logger.info('Cache miss for guides list, querying database');
  const guides = await db.guide.findMany({
    where: { isDeleted: false },
    include: {
      user: { select: { username: true } },
      game: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  await setCache(cacheKey, guides, 300);
  return guides;
};

const getGuideById = async (id) => {
  const guide = await db.guide.findUnique({
    where: { id },
    include: {
      user: { select: { username: true } },
      game: { select: { title: true } },
      comments: {
        include: {
          user: { select: { username: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!guide || guide.isDeleted) {
    throw new AppError('Guide not found.', 404);
  }

  return guide;
};

const createGuide = async (userId, dto) => {
  // Check if game exists
  const game = await db.game.findUnique({
    where: { id: dto.gameId }
  });
  if (!game) {
    throw new AppError('Game not found.', 404);
  }

  const newGuide = await db.guide.create({
    data: {
      title: dto.title,
      content: dto.content,
      gameId: dto.gameId,
      userId: userId
    }
  });

  // Invalidate cache
  await deleteCache('guides:list');
  logger.info(`Guide created: "${newGuide.title}" by User ${userId}`);
  return newGuide;
};

const updateGuide = async (id, userId, userRole, dto) => {
  const guide = await db.guide.findUnique({
    where: { id }
  });
  if (!guide || guide.isDeleted) {
    throw new AppError('Guide not found.', 404);
  }

  // Authorization check: Guide Owner, EDITOR or ADMIN
  const isOwner = guide.userId === userId;
  const isAuthorized = isOwner || ['ADMIN', 'EDITOR'].includes(userRole);

  if (!isAuthorized) {
    throw new AppError('Access denied. You do not have permission to update this guide.', 403);
  }

  if (dto.gameId) {
    const game = await db.game.findUnique({
      where: { id: dto.gameId }
    });
    if (!game) {
      throw new AppError('Game not found.', 404);
    }
  }

  const updatedGuide = await db.guide.update({
    where: { id },
    data: {
      title: dto.title || undefined,
      content: dto.content || undefined,
      gameId: dto.gameId || undefined
    }
  });

  // Invalidate cache
  await deleteCache('guides:list');
  logger.info(`Guide updated: ID ${id}`);
  return updatedGuide;
};

const deleteGuide = async (id, userId, userRole) => {
  const guide = await db.guide.findUnique({
    where: { id }
  });
  if (!guide) {
    throw new AppError('Guide not found.', 404);
  }

  // Authorization check: Guide Owner, EDITOR or ADMIN
  const isOwner = guide.userId === userId;
  const isAuthorized = isOwner || ['ADMIN', 'EDITOR'].includes(userRole);

  if (!isAuthorized) {
    throw new AppError('Access denied. You do not have permission to delete this guide.', 403);
  }

  await db.guide.update({
    where: { id },
    data: { isDeleted: true }
  });

  // Invalidate cache
  await deleteCache('guides:list');
  logger.info(`Guide deleted: ID ${id}`);
  return { message: 'Guide deleted successfully.' };
};

const addComment = async (userId, guideId, content) => {
  if (!content || !content.trim()) {
    throw new AppError('Comment content is required.', 400);
  }

  const guide = await db.guide.findUnique({
    where: { id: guideId }
  });
  if (!guide) {
    throw new AppError('Guide not found.', 404);
  }

  const comment = await db.comment.create({
    data: {
      content: content.trim(),
      userId,
      guideId
    },
    include: {
      user: { select: { username: true } }
    }
  });

  logger.info(`Comment added by User ${userId} on Guide ${guideId}`);
  return comment;
};

module.exports = {
  getAllGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide,
  addComment
};
