import express from "express";

import routes from "./routes";

const app = express();

app.use(express.json());

app.use("/", routes);

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) console.log("Error:", err.message);
  console.log(`Server running on port ${port}`);
});
