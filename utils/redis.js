const redis = require("redis");
const { promisify } = require("util");

class RedisClient {
  constructor() {
    this.client = redis.createClient({ url: "redis://localhost:6379" });
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on("error", (err) => console.log(err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.getAsync(key);
  }

  async set(key, value, duration) {
    return this.client.setex(key, duration, value);
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
