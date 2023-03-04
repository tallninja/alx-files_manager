import redisClient from "../utils/redis";
import dbClient from "../utils/db";

const getStatus = (req, res) => {
  return res
    .status(200)
    .json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
};

const getStats = async (req, res) => {
  const nbUsers = await dbClient.nbUsers();
  const nbFiles = await dbClient.nbFiles();
  return res.status(200).json({ users: nbUsers, files: nbFiles });
};

export default { getStatus, getStats };
