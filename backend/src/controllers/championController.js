const db = require('../config/db');
const AppError = require('../errors/AppError');

// â”€â”€â”€ GET ALL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.getAllChampions = async (req, res, next) => {
  try {
    const { gameId, role } = req.query;
    const where = {};
    if (gameId) where.gameId = parseInt(gameId);
    if (role)   where.role   = role;

    const champions = await db.champion.findMany({
      where,
      include: { game: { select: { title: true } } },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json({ success: true, champions });
  } catch (err) { next(err); }
};

// â”€â”€â”€ GET BY ID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.getChampionById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const champion = await db.champion.findUnique({
      where: { id },
      include: {
        game: { select: { title: true } },
        skills: true
      }
    });
    if (!champion) return next(new AppError('Champion Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹.', 404));
    return res.status(200).json({ success: true, champion });
  } catch (err) { next(err); }
};

// â”€â”€â”€ CREATE (EDITOR / ADMIN) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.createChampion = async (req, res, next) => {
  try {
    const { name, role, difficulty, description, imageUrl, gameId, guideData } = req.body;
    if (!name || !role || !gameId)
      return next(new AppError('name, role, gameId ÑˆÐ°Ð°Ñ€Ð´Ð»Ð°Ð³Ð°Ñ‚Ð°Ð¹.', 400));

    const game = await db.game.findUnique({ where: { id: parseInt(gameId) } });
    if (!game) return next(new AppError('Game Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹.', 404));

    const champion = await db.champion.create({
      data: { name, role, difficulty: difficulty || 'Medium', description: description || '', imageUrl, gameId: parseInt(gameId), guideData }
    });
    return res.status(201).json({ success: true, message: 'Champion Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ.', champion });
  } catch (err) { next(err); }
};

// â”€â”€â”€ UPDATE (EDITOR / ADMIN) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.updateChampion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, difficulty, description, imageUrl, guideData } = req.body;

    const existing = await db.champion.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Champion Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹.', 404));

    const champion = await db.champion.update({
      where: { id },
      data: { name, role, difficulty, description, imageUrl, guideData }
    });
    return res.status(200).json({ success: true, message: 'Champion ÑˆÐ¸Ð½ÑÑ‡Ð»ÑÐ³Ð´Ð»ÑÑ.', champion });
  } catch (err) { next(err); }
};

// â”€â”€â”€ DELETE (ADMIN only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.deleteChampion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db.champion.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Champion Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹.', 404));
    await db.champion.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Champion ÑƒÑÑ‚Ð³Ð°Ð³Ð´Ð»Ð°Ð°.' });
  } catch (err) { next(err); }
};
