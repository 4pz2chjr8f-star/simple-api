export function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  console.error(error);

  res.status(500).json({ message: "Internal server error" });
}
