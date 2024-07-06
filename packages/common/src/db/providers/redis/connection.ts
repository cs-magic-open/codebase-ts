import Redis from "ioredis"

import { getEnv } from "../../../env/index.js"

const env = getEnv()

const createRedisClient = () =>
  new Redis().on("error", (err) => console.log("Redis Client Error", err))
export const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createRedisClient> | undefined
}
export const redis = globalForRedis.redis ?? createRedisClient()
if (env.NODE_ENV !== "production") globalForRedis.redis = redis
