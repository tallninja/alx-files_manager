import redis from "redis";

class RedisClient {
  constructor() {
    this.client = redis.createClient({ url: "redis://localhost:6379" });
    this.client.on("error", (err) => console.log(err))(
      async () => await this.client.connect()
    )();
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    return this.client.setx(key, value, duration);
  }

  async del(key) {
    return this.client.delete(key);
  }
}

export const redisClient = new RedisClient();
