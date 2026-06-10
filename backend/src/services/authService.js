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

  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role
  });

  logger.info(`User registered successfully: ${newUser.username} (${newUser.id})`);
  return {
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      lastLoginAt: newUser.lastLoginAt,
      createdAt: newUser.createdAt
    }
  };
};

const loginUser = async (dto) => {
  // Find user
  const user = await db.user.findUnique({
    where: { email: dto.email }
  });

  if (!user || user.isDeleted) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare passwords
  const isMatch = await comparePassword(dto.password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const loggedInUser = await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  // Generate token
  const token = generateToken({
    id: loggedInUser.id,
    username: loggedInUser.username,
    email: loggedInUser.email,
    role: loggedInUser.role
  });

  logger.info(`User logged in successfully: ${loggedInUser.username} (${loggedInUser.id})`);

  return {
    token,
    user: {
      id: loggedInUser.id,
      username: loggedInUser.username,
      email: loggedInUser.email,
      role: loggedInUser.role,
      lastLoginAt: loggedInUser.lastLoginAt,
      createdAt: loggedInUser.createdAt
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
