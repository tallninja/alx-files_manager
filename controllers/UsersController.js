import sha1 from "sha1";
import dbClient from "../utils/db";

const usersCollection = dbClient.db?.collection("users");

const postNew = async (req, res) => {
  try {
    const user = req.body;

    // check if email is missing
    if (!user.email) return res.status(400).json({ error: "Missing email" });

    // check if password is missing
    if (!user.password)
      return res.status(400).json({ error: "Missing password" });

    // check if user with that email already exists in DB
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) return res.status(400).json({ error: "Already exists" });

    // hash password
    user.password = sha1(user.password);

    // save the user in DB
    const { ops } = await usersCollection.insertOne(user);
    const { _id, email } = ops[0];

    // return a response
    return res.status(201).json({ id: _id, email });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export default { postNew };
