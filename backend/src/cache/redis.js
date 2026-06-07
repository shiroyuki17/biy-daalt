const { createClient } = require('redis');
const logger = require('../utils/logger');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Stop retrying after 3 attempts (fallback to DB)
      if (retries >= 3) return false;
      return Math.min(retries * 100, 500);
    }
  }
});

let isRedisConnected = false;

client.on('error', (err) => {
  // Silent catch — Redis is optional, DB is the fallback
  if (err.code !== 'ECONNREFUSED') {
    logger.error('Redis Client Error: ' + err.message);
  }
});

(async () => {
  try {
    await client.connect();
    isRedisConnected = true;
    logger.info('Redis client connected successfully.');
  } catch (err) {
    logger.warn('Redis unavailable. Cache disabled, falling back to Database.');
  }
})();

const getCache = async (key) => {
  if (!isRedisConnected) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.error(`Error getting cache for key ${key}: ` + err.message);
    return null;
  }
};

const setCache = async (key, data, ttlSeconds = 300) => {
  if (!isRedisConnected) return;
  try {
    await client.set(key, JSON.stringify(data), {
      EX: ttlSeconds
    });
  } catch (err) {
    logger.error(`Error setting cache for key ${key}: ` + err.message);
  }
};

const deleteCache = async (key) => {
  if (!isRedisConnected) return;
  try {
    await client.del(key);
  } catch (err) {
    logger.error(`Error deleting cache for key ${key}: ` + err.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache
};
