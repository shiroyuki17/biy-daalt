const adminService = require('../services/adminService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;

    const user = await adminService.updateUserRole(userId, role);
    return res.status(200).json({
      success: true,
      message: 'User role updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const result = await adminService.deleteUser(userId);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};
