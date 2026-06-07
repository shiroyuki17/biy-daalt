const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Бүх user route нэвтэрсэн байх шаардлагатай
router.use(authenticateToken);

// GET /api/users/me — өөрийн мэдээлэл харах
router.get('/me', userController.getProfile);

// GET /api/users/me/guides — өөрийн guide-уудыг харах
router.get('/me/guides', userController.getMyGuides);

module.exports = router;
