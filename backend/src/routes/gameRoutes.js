const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);

// Restricted mutations
router.post('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), gameController.createGame);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), gameController.updateGame);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), gameController.deleteGame);

module.exports = router;
