const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/cryptoHelper');
const { generateToken } = require('../utils/jwtHelper');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const registerUser = async (dto) => {
  // Check if username or email is already taken
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email: dto.email },
        { username: dto.username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === dto.email) {
      throw new AppError('Email is already registered.', 400);
    }
    if (existingUser.username === dto.username) {
      throw new AppError('Username is already taken.', 400);
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(dto.password);

  // Create user
  const newUser = await db.user.create({
    data: {
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: 'USER'
    }
  });

  logger.info(`User registered successfully: ${newUser.username} (${newUser.id})`);
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role
  };
};

const loginUser = async (dto) => {
  // Find user
  const user = await db.user.findUnique({
    where: { email: dto.email }
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare passwords
  const isMatch = await comparePassword(dto.password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });

  logger.info(`User logged in successfully: ${user.username} (${user.id})`);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
