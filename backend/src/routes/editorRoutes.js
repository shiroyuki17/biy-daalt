const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editorController');
const gameController   = require('../controllers/gameController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Бүх editor route: нэвтэрсэн + EDITOR эрхтэй байх
router.use(authenticateToken, requireRole(['EDITOR', 'ADMIN']));

// --- Guide Management ---
// GET  /api/editor/guides        — бүх guide харах
router.get('/guides', editorController.getAllGuides);

// PUT  /api/editor/guides/:id    — guide засах
router.put('/guides/:id', editorController.updateGuide);

// DELETE /api/editor/guides/:id  — guide устгах
router.delete('/guides/:id', editorController.deleteGuide);

// --- Game Management ---
// POST /api/editor/games         — game нэмэх
router.post('/games', gameController.createGame);

// PUT  /api/editor/games/:id     — game засах
router.put('/games/:id', gameController.updateGame);

module.exports = router;
