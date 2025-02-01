import { redisClient } from "../config/redis";

export class InMemoryStore {
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redisClient.setex(key, ttl, value); 
    } else {
      await redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async cleanup(): Promise<any> {
    let expireKeys:any = []
    const keys = await redisClient.keys("*");
    for (const key of keys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -2) {
        expireKeys.push(key)
        await redisClient.del(key);
      } else if (ttl <= 0) { 
        expireKeys.push(key); 
        await redisClient.del(key);
    }
    return expireKeys;
  }
}
}
