import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "simple-api" });
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
