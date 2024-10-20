import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import userRoutes from "./routes/userRoutes.js";
import adRoutes from "./routes/adRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db(process.env.DATABASE_NAME);
    console.log("Connected to MongoDB");

    app.use(express.json());
    app.use("/users", userRoutes(db));
    app.use("/ads", adRoutes(db));

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if DB connection fails
  }
}

startServer();
