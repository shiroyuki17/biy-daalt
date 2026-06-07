const { GuideCreateDTO } = require('../dto/guideDTO');
const { validateGuideCreate } = require('../validators/validator');
const guideService = require('../services/guideService');

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

exports.getGuideById = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    const guide = await guideService.getGuideById(guideId);
    return res.status(200).json({
      success: true,
      guide
    });
  } catch (error) {
    next(error);
  }
};

exports.createGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dto = new GuideCreateDTO(req.body);
    validateGuideCreate(dto);

    const guide = await guideService.createGuide(userId, dto);
    return res.status(201).json({
      success: true,
      message: 'Guide created successfully.',
      guide
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;
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

exports.deleteGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await guideService.deleteGuide(guideId, userId, userRole);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const guideId = parseInt(req.params.guideId, 10);
    const { content } = req.body;

    const comment = await guideService.addComment(userId, guideId, content);
    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment
    });
  } catch (error) {
    next(error);
  }
};
