import redis from "redis";
import { promisify } from "util";

class RedisClient {
  constructor() {
    this.client = redis.createClient({ url: "redis://localhost:6379" });
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.client.on("error", (err) => console.log(err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.getAsync(key);
  }

  async set(key, value, duration) {
    return await this.setexAsync(key, duration, value);
  }

  async del(key) {
    return await this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
