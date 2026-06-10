const db = require('../config/db');
const AppError = require('../errors/AppError');

exports.getAllRunes = async (req, res, next) => {
  try {
    const { gameId, type } = req.query;
    const where = {};
    if (gameId) where.gameId = parseInt(gameId);
    if (type)   where.type   = type;

    const runes = await db.rune.findMany({
      where,
      include: { game: { select: { title: true } } },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json({ success: true, runes });
  } catch (err) { next(err); }
};

exports.getRuneById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const rune = await db.rune.findUnique({
      where: { id },
      include: { game: { select: { title: true } } }
    });
    if (!rune) return next(new AppError('Rune олдсонгүй.', 404));
    return res.status(200).json({ success: true, rune });
  } catch (err) { next(err); }
};

exports.createRune = async (req, res, next) => {
  try {
    const { name, type, description, imageUrl, gameId } = req.body;
    if (!name || !gameId)
      return next(new AppError('name, gameId шаардлагатай.', 400));

    const game = await db.game.findUnique({ where: { id: parseInt(gameId) } });
    if (!game) return next(new AppError('Game олдсонгүй.', 404));

    const rune = await db.rune.create({
      data: { name, type: type || 'Primary', description: description || '', imageUrl, gameId: parseInt(gameId) }
    });
    return res.status(201).json({ success: true, message: 'Rune (emblem) амжилттай нэмэгдлээ.', rune });
  } catch (err) { next(err); }
};

exports.updateRune = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, description, imageUrl } = req.body;

    const existing = await db.rune.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Rune олдсонгүй.', 404));

    const rune = await db.rune.update({
      where: { id },
      data: { name, type, description, imageUrl }
    });
    return res.status(200).json({ success: true, message: 'Rune шинэчлэгдлээ.', rune });
  } catch (err) { next(err); }
};

exports.deleteRune = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db.rune.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Rune олдсонгүй.', 404));
    await db.rune.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Rune устгагдлаа.' });
  } catch (err) { next(err); }
};
