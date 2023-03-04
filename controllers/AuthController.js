import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import sha1 from "sha1";
import dbClient from "../utils/db";
import redisClient from "../utils/redis";

const usersCollection = dbClient.db.collection("users");

const getConnect = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    // check if header exists first
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    // extract creadentials from header
    const [type, credentials] = authHeader.split(" ");

    // check if user supplied the credentials and used the correct format
    if (!credentials || type !== "Basic")
      return res.status(401).json({ error: "Unauthorized" });

    // decode the base64 text
    const [email, password] = Buffer.from(credentials, "base64")
      .toString()
      .split(":");

    // fetch user form DB
    const user = await usersCollection.findOne({
      email,
      password: sha1(password),
    });

    // check if user exists
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // generate token
    const token = uuidv4();

    // create a key
    const key = `auth_${token}`;

    // store key in redis for 24 hours
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

    // send token to user
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getDisconnect = async (req, res) => {
  try {
    // check if user exists in DB
    const user = await usersCollection.findOne({ _id: ObjectId(req.userId) });
    if (!user) {
      // delete token from redis
      await redisClient.del(token);
      return res.status(401).json({ error: "Unauthorized" });
    }

    // delete the token in redis
    await redisClient.del(key);

    // return nothing
    return res.status(204).send();
  } catch (error) {
    console.log("Error:", error.message);
    return res.stsa(500).json({ error: error.message });
  }
};

export default { getConnect, getDisconnect };
