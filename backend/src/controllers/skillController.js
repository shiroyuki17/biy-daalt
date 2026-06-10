const db = require('../config/db');
const AppError = require('../errors/AppError');

// ─── GET ALL ─────────────────────────────────────────────────
exports.getAllSkills = async (req, res, next) => {
  try {
    const { championId } = req.query;
    const where = {};
    if (championId) where.championId = parseInt(championId);

    const skills = await db.skill.findMany({
      where,
      include: { champion: { select: { name: true } } },
      orderBy: { skillType: 'asc' }
    });
    return res.status(200).json({ success: true, skills });
  } catch (err) { next(err); }
};

// ─── GET BY ID ───────────────────────────────────────────────
exports.getSkillById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const skill = await db.skill.findUnique({
      where: { id },
      include: { champion: { select: { name: true } } }
    });
    if (!skill) return next(new AppError('Skill олдсонгүй.', 404));
    return res.status(200).json({ success: true, skill });
  } catch (err) { next(err); }
};

// ─── CREATE (EDITOR / ADMIN) ─────────────────────────────────
exports.createSkill = async (req, res, next) => {
  try {
    const { name, description, damage, cooldown, manaCost, skillType, championId } = req.body;
    if (!name || !skillType || !championId)
      return next(new AppError('name, skillType, championId шаардлагатай.', 400));

    const champion = await db.champion.findUnique({ where: { id: parseInt(championId) } });
    if (!champion) return next(new AppError('Champion олдсонгүй.', 404));

    const skill = await db.skill.create({
      data: {
        name, description: description || '', damage, cooldown, manaCost,
        skillType, championId: parseInt(championId)
      }
    });
    return res.status(201).json({ success: true, message: 'Skill амжилттай нэмэгдлээ.', skill });
  } catch (err) { next(err); }
};

// ─── UPDATE (EDITOR / ADMIN) ─────────────────────────────────
exports.updateSkill = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, damage, cooldown, manaCost, skillType } = req.body;

    const existing = await db.skill.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Skill олдсонгүй.', 404));

    const skill = await db.skill.update({
      where: { id },
      data: { name, description, damage, cooldown, manaCost, skillType }
    });
    return res.status(200).json({ success: true, message: 'Skill шинэчлэгдлээ.', skill });
  } catch (err) { next(err); }
};

// ─── DELETE (ADMIN only) ─────────────────────────────────────
exports.deleteSkill = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db.skill.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Skill олдсонгүй.', 404));
    await db.skill.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Skill устгагдлаа.' });
  } catch (err) { next(err); }
};
