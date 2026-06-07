const AppError = require('../errors/AppError');

const validateRegister = (dto) => {
  if (!dto.username || dto.username.length < 3) {
    throw new AppError('Username must be at least 3 characters long.', 400);
  }
  if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
    throw new AppError('A valid email address is required.', 400);
  }
  if (!dto.password || dto.password.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400);
  }
};

const validateLogin = (dto) => {
  if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
    throw new AppError('A valid email address is required.', 400);
  }
  if (!dto.password) {
    throw new AppError('Password is required.', 400);
  }
};

const validateGameCreate = (dto) => {
  if (!dto.title || dto.title.length < 2) {
    throw new AppError('Game title must be at least 2 characters long.', 400);
  }
  if (!dto.genre) {
    throw new AppError('Game genre is required.', 400);
  }
  if (!dto.description) {
    throw new AppError('Game description is required.', 400);
  }
};

const validateGuideCreate = (dto) => {
  if (!dto.title || dto.title.length < 3) {
    throw new AppError('Guide title must be at least 3 characters long.', 400);
  }
  if (!dto.content) {
    throw new AppError('Guide content is required.', 400);
  }
  if (!dto.gameId || isNaN(dto.gameId)) {
    throw new AppError('A valid Game ID is required.', 400);
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateGameCreate,
  validateGuideCreate
};
