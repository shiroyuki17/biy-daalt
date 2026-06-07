const { GuideCreateDTO } = require('../dto/guideDTO');
const { validateGuideCreate } = require('../validators/validator');
const guideService = require('../services/guideService');

// GET /api/editor/guides — бүх guide-уудыг харах (EDITOR эрхтэй)
exports.getAllGuides = async (req, res, next) => {
  try {
    const guides = await guideService.getAllGuides();
    return res.status(200).json({
      success: true,
      guides
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/editor/guides/:id — бусдын guide засах
exports.updateGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    const userId   = req.user.id;
    const userRole = req.user.role; // EDITOR
    const dto = new GuideCreateDTO(req.body);

    const guide = await guideService.updateGuide(guideId, userId, userRole, dto);
    return res.status(200).json({
      success: true,
      message: 'Guide updated successfully.',
      guide
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/editor/guides/:id — бусдын guide устгах
exports.deleteGuide = async (req, res, next) => {
  try {
    const guideId  = parseInt(req.params.id, 10);
    const userId   = req.user.id;
    const userRole = req.user.role; // EDITOR

    const result = await guideService.deleteGuide(guideId, userId, userRole);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
