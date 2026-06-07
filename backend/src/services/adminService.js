const db = require('../config/db');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const getAllUsers = async () => {
  return await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const updateUserRole = async (id, role) => {
  const validRoles = ['ADMIN', 'EDITOR', 'USER'];
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role. Role must be: ADMIN, EDITOR, or USER', 400);
  }

  const user = await db.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true
    }
  });

  logger.info(`User role updated: User ${id} is now ${role}`);
  return updatedUser;
};

const deleteUser = async (id) => {
  const user = await db.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await db.user.delete({
    where: { id }
  });

  logger.info(`User deleted: ID ${id}`);
  return { message: 'User deleted successfully.' };
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser
};
