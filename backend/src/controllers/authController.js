const { RegisterDTO, LoginDTO } = require('../dto/authDTO');
const { validateRegister, validateLogin } = require('../validators/validator');
const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const dto = new RegisterDTO(req.body);
    validateRegister(dto);

    const user = await authService.registerUser(dto);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const dto = new LoginDTO(req.body);
    validateLogin(dto);

    const result = await authService.loginUser(dto);
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      ...result
    });
  } catch (error) {
    next(error);
  }
};
