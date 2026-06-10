const db = require('../config/db');
const AppError = require('../errors/AppError');

exports.getAllItems = async (req, res, next) => {
  try {
    const { gameId, type } = req.query;
    const where = {};
    if (gameId) where.gameId = parseInt(gameId);
    if (type)   where.type   = type;

    const items = await db.item.findMany({
      where,
      include: { game: { select: { title: true } } },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json({ success: true, items });
  } catch (err) { next(err); }
};

exports.getItemById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await db.item.findUnique({
      where: { id },
      include: { game: { select: { title: true } } }
    });
    if (!item) return next(new AppError('Item олдсонгүй.', 404));
    return res.status(200).json({ success: true, item });
  } catch (err) { next(err); }
};

exports.createItem = async (req, res, next) => {
  try {
    const { name, type, description, price, imageUrl, gameId, stats } = req.body;
    if (!name || !gameId)
      return next(new AppError('name, gameId шаардлагатай.', 400));

    const game = await db.game.findUnique({ where: { id: parseInt(gameId) } });
    if (!game) return next(new AppError('Game олдсонгүй.', 404));

    const item = await db.item.create({
      data: { name, type: type || 'Basic', description: description || '', price: parseInt(price) || 0, imageUrl, gameId: parseInt(gameId), stats }
    });
    return res.status(201).json({ success: true, message: 'Item амжилттай нэмэгдлээ.', item });
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, description, price, imageUrl, stats } = req.body;

    const existing = await db.item.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Item олдсонгүй.', 404));

    const item = await db.item.update({
      where: { id },
      data: { name, type, description, price: price ? parseInt(price) : undefined, imageUrl, stats }
    });
    return res.status(200).json({ success: true, message: 'Item шинэчлэгдлээ.', item });
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db.item.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Item олдсонгүй.', 404));
    await db.item.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Item устгагдлаа.' });
  } catch (err) { next(err); }
};
