const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const buildDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined in .env');
  }

  const url = new URL(dbUrl);
  const defaultConnectionLimit = process.env.NODE_ENV === 'production' ? '10' : '5';

  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', process.env.DB_CONNECTION_LIMIT || defaultConnectionLimit);
  }

  if (!url.searchParams.has('pool_timeout')) {
    url.searchParams.set('pool_timeout', process.env.DB_POOL_TIMEOUT || '10');
  }

  return url.toString();
};

const adapter = new PrismaMariaDb(buildDatabaseUrl());

const createPrismaClient = () => new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn']
});

const globalForPrisma = globalThis;
const prisma = globalForPrisma.__gamingGuidePrisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__gamingGuidePrisma = prisma;
}

prisma.testConnection = async () => {
  await prisma.$queryRaw`SELECT 1`;
  return true;
};

module.exports = prisma;
