const db = require('../config/db');
const AppError = require('../errors/AppError');

// ─── GET ALL ─────────────────────────────────────────────────
exports.getAllSpells = async (req, res, next) => {
  try {
    const { gameId } = req.query;
    const where = {};
    if (gameId) where.gameId = parseInt(gameId);

    const spells = await db.spell.findMany({
      where,
      include: { game: { select: { title: true } } },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json({ success: true, spells });
  } catch (err) { next(err); }
};

// ─── GET BY ID ───────────────────────────────────────────────
exports.getSpellById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const spell = await db.spell.findUnique({
      where: { id },
      include: { game: { select: { title: true } } }
    });
    if (!spell) return next(new AppError('Spell олдсонгүй.', 404));
    return res.status(200).json({ success: true, spell });
  } catch (err) { next(err); }
};

// ─── CREATE (EDITOR / ADMIN) ─────────────────────────────────
exports.createSpell = async (req, res, next) => {
  try {
    const { name, description, cooldown, imageUrl, gameId } = req.body;
    if (!name || !gameId)
      return next(new AppError('name, gameId шаардлагатай.', 400));

    const game = await db.game.findUnique({ where: { id: parseInt(gameId) } });
    if (!game) return next(new AppError('Game олдсонгүй.', 404));

    const spell = await db.spell.create({
      data: {
        name, description: description || '', cooldown: cooldown ? parseInt(cooldown) : 0,
        imageUrl, gameId: parseInt(gameId)
      }
    });
    return res.status(201).json({ success: true, message: 'Spell амжилттай нэмэгдлээ.', spell });
  } catch (err) { next(err); }
};

// ─── UPDATE (EDITOR / ADMIN) ─────────────────────────────────
exports.updateSpell = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, cooldown, imageUrl } = req.body;

    const existing = await db.spell.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Spell олдсонгүй.', 404));

    const spell = await db.spell.update({
      where: { id },
      data: { name, description, cooldown: cooldown ? parseInt(cooldown) : undefined, imageUrl }
    });
    return res.status(200).json({ success: true, message: 'Spell шинэчлэгдлээ.', spell });
  } catch (err) { next(err); }
};

// ─── DELETE (ADMIN only) ─────────────────────────────────────
exports.deleteSpell = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db.spell.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Spell олдсонгүй.', 404));
    await db.spell.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Spell устгагдлаа.' });
  } catch (err) { next(err); }
};
