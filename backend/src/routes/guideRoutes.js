const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);

// Protected routes
router.post('/', authenticateToken, guideController.createGuide);
router.put('/:id', authenticateToken, guideController.updateGuide);
router.delete('/:id', authenticateToken, guideController.deleteGuide);

// Comment routes
router.post('/:guideId/comments', authenticateToken, guideController.addComment);

module.exports = router;
