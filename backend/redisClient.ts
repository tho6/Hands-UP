import redis from 'redis';
const { promisify } = require("util");
export const redisClient = redis.createClient();
export const getAsync = promisify(redisClient.get).bind(redisClient);
export const setAsync = promisify(redisClient.set).bind(redisClient);
export const getHallAsync = promisify(redisClient.hgetall).bind(redisClient);
export const setHmAsync = promisify(redisClient.hset).bind(redisClient);
export const delAsync = promisify(redisClient.del).bind(redisClient);
