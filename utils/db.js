import { MongoClient } from "mongodb";

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";
    const uri = `mongodb://${host}:${port}`;

    // set connection state to false first
    this.connected = false;

    // create mongo client
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // connect to client asynchronously
    (async () => {
      await this.client.connect((err) => {
        if (err) console.log("Error:", "Failed to connect to DB", err.message);
        this.connected = true;
        this.db = this.client.db(database);
      });
    })();
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      const usersCount = await this.db
        .collection("users")
        .estimatedDocumentCount();
      return usersCount;
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  async nbFiles() {
    try {
      const filesCount = await this.db
        .collection("files")
        .estimatedDocumentCount();
      return filesCount;
    } catch (error) {
      console.log("Error:", error.message);
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
