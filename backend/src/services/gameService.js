const db = require('../config/db');
const { getCache, setCache, deleteCache } = require('../cache/redis');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const getAllGames = async () => {
  const cacheKey = 'games:list';
  
  // Try to get from cache
  const cachedGames = await getCache(cacheKey);
  if (cachedGames) {
    logger.info('Cache hit for games list');
    return cachedGames;
  }

  logger.info('Cache miss for games list, querying database');
  const games = await db.game.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Set cache
  await setCache(cacheKey, games, 300); // 5 min TTL
  return games;
};

const getGameById = async (id) => {
  const game = await db.game.findUnique({
    where: { id }
  });

  if (!game) {
    throw new AppError('Game not found.', 404);
  }

  return game;
};

const createGame = async (dto) => {
  // Check duplicate title
  const existingGame = await db.game.findUnique({
    where: { title: dto.title }
  });
  if (existingGame) {
    throw new AppError('Game title already exists.', 400);
  }

  const newGame = await db.game.create({
    data: {
      title: dto.title,
      genre: dto.genre,
      description: dto.description,
      image: dto.image
    }
  });

  // Invalidate cache
  await deleteCache('games:list');
  logger.info(`Game created: ${newGame.title}`);
  return newGame;
};

const updateGame = async (id, dto) => {
  // Verify game exists
  await getGameById(id);

  if (dto.title) {
    const duplicate = await db.game.findFirst({
      where: { title: dto.title, NOT: { id } }
    });
    if (duplicate) {
      throw new AppError('Game title is already taken.', 400);
    }
  }

  const updatedGame = await db.game.update({
    where: { id },
    data: {
      title: dto.title || undefined,
      genre: dto.genre || undefined,
      description: dto.description || undefined,
      image: dto.image || undefined
    }
  });

  // Invalidate cache
  await deleteCache('games:list');
  logger.info(`Game updated: ${updatedGame.title}`);
  return updatedGame;
};

const deleteGame = async (id) => {
  // Verify game exists
  await getGameById(id);

  await db.game.delete({
    where: { id }
  });

  // Invalidate cache
  await deleteCache('games:list');
  logger.info(`Game deleted: ID ${id}`);
  return { message: 'Game deleted successfully.' };
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};
