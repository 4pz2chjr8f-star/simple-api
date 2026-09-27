import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "simple-api" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

startServer();
