import redisClient from "../utils/redis";

const verifyToken = async (req, res, next) => {
  try {
    // extract token from header
    const token = req.headers["x-token"];

    // check if token has been provided
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const key = `auth_${token}`;

    // fetch user based on token
    const userId = await redisClient.get(key);

    // check if user exists in redis
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    req.userId = userId;

    next();
  } catch (error) {
    console.log("Error:", error.message);
    return res.stsa(500).json({ error: error.message });
  }
};

export default verifyToken;
