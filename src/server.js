import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// * Middlewares

app.use(express.json());
app.use("/users", userRoutes);

// * Routes

app.get("/", (req, res) => {
  res.json({ message: "simple-api" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Listening at ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

startServer();
