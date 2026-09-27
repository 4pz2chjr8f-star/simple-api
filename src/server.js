import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "simple-api" });
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
