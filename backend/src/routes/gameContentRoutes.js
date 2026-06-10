const express = require('express');
const router = express.Router();
const championController = require('../controllers/championController');
const itemController     = require('../controllers/itemController');
const runeController     = require('../controllers/runeController');
const skillController    = require('../controllers/skillController');
const spellController    = require('../controllers/spellController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const EDITOR_ADMIN = requireRole(['EDITOR', 'ADMIN']);
const ADMIN_ONLY   = requireRole(['ADMIN']);

// ─── CHAMPIONS ─────────────────────────────────────────────
router.get('/champions',     championController.getAllChampions);
router.get('/champions/:id', championController.getChampionById);
router.post('/champions',     authenticateToken, EDITOR_ADMIN, championController.createChampion);
router.put('/champions/:id',  authenticateToken, EDITOR_ADMIN, championController.updateChampion);
router.delete('/champions/:id', authenticateToken, ADMIN_ONLY, championController.deleteChampion);

// ─── SKILLS (Champion Abilities) ──────────────────────────
router.get('/skills',     skillController.getAllSkills);
router.get('/skills/:id', skillController.getSkillById);
router.post('/skills',     authenticateToken, EDITOR_ADMIN, skillController.createSkill);
router.put('/skills/:id',  authenticateToken, EDITOR_ADMIN, skillController.updateSkill);
router.delete('/skills/:id', authenticateToken, ADMIN_ONLY, skillController.deleteSkill);

// ─── ITEMS ─────────────────────────────────────────────────
router.get('/items',     itemController.getAllItems);
router.get('/items/:id', itemController.getItemById);
router.post('/items',     authenticateToken, EDITOR_ADMIN, itemController.createItem);
router.put('/items/:id',  authenticateToken, EDITOR_ADMIN, itemController.updateItem);
router.delete('/items/:id', authenticateToken, ADMIN_ONLY, itemController.deleteItem);

// ─── RUNES (Emblem) ────────────────────────────────────────
router.get('/runes',     runeController.getAllRunes);
router.get('/runes/:id', runeController.getRuneById);
router.post('/runes',     authenticateToken, EDITOR_ADMIN, runeController.createRune);
router.put('/runes/:id',  authenticateToken, EDITOR_ADMIN, runeController.updateRune);
router.delete('/runes/:id', authenticateToken, ADMIN_ONLY, runeController.deleteRune);

// ─── SPELLS (Summoner Spells) ──────────────────────────────
router.get('/spells',     spellController.getAllSpells);
router.get('/spells/:id', spellController.getSpellById);
router.post('/spells',     authenticateToken, EDITOR_ADMIN, spellController.createSpell);
router.put('/spells/:id',  authenticateToken, EDITOR_ADMIN, spellController.updateSpell);
router.delete('/spells/:id', authenticateToken, ADMIN_ONLY, spellController.deleteSpell);

module.exports = router;
