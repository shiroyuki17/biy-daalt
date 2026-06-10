const db = require('../config/db');
const AppError = require('../errors/AppError');

// GET /api/users/me — өөрийн profile харах
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isDeleted: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            guides: true,
            comments: true
          }
        }
      }
    });

    if (!user || user.isDeleted) {
      return next(new AppError('User not found.', 404));
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me/guides — өөрийн guide-уудыг харах
exports.getMyGuides = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const guides = await db.guide.findMany({
      where: { userId, isDeleted: false },
      include: {
        game: { select: { title: true, genre: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      guides
    });
  } catch (error) {
    next(error);
  }
};
