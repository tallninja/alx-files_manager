import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import dbClient from "../utils/db";
import { promisify } from "util";

const filesCollection = dbClient.db.collection("files");

const postUpload = async (req, res) => {
  try {
    // extract contents of a file
    const { name, type, parentId, isPublic, data } = req.body;

    // check if properties of the file are defined correctly
    if (!name) return res.status(400).json({ error: "Missing name" });
    if (!type) return res.status(400).json({ error: "Missing type" });
    if (!data && type !== "folder")
      return res.status(400).json({ error: "Missing data" });

    if (parentId) {
      // fetch parent file from DB
      const parent = await filesCollection.findOne({ _id: ObjectId(parentId) });

      // check if parent file exists
      if (!parent) return res.status(400).json({ error: "Parent not found" });

      // check if the parent is a folder
      if (parent.type !== "folder")
        return res.status(400).json({ error: "Parent is not a folder" });
    }

    if (type === "folder") {
      const newFolder = await filesCollection.insertOne({
        name,
        type,
        parentId,
        isPublic: isPublic || false,
        userId: ObjectId(req.userId),
      });
      return res.status(201).json(newFolder?.ops[0]);
    } else {
      const folderPath = process.env.FOLDER_PATH || "/tmp/files_manager";

      // check if folder path exist
      if (!fs.existsSync(folderPath)) {
        // create the folder locally if it does not exist
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // save the file in the folder
      const fileName = uuidv4();
      const filePath = `${folderPath}/${fileName}`;
      const saveFile = promisify(fs.writeFile);
      await saveFile(filePath, Buffer.from(data, "base64").toString());

      // add the file document to the collection
      const newFile = await filesCollection.insertOne({
        name,
        type,
        isPublic: isPublic || false,
        parentId: parentId || 0,
        userId: ObjectId(req.userId),
        localPath: filePath,
      });

      return res.status(201).json(newFile?.ops[0]);
    }
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export default { postUpload };
