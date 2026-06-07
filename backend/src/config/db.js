const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in .env');
}

// @prisma/adapter-mariadb нь URL-г шууд авдаг
// Pool объект биш, URL string дамжуулах нь илүү найдвартай
const adapter = new PrismaMariaDb(dbUrl);

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn']
});

module.exports = prisma;
