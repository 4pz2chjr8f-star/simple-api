export function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (error.name === "ValidationError") {
    const errors = {};

    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }

    return res.status(400).json({ message: "Validation failed", errors });
  }
  console.error(error);

  res.status(500).json({ message: "Internal server error" });
}
