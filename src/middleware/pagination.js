import { json } from "express";

export function validatePagination(req, res, next) {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);

  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (page < 1) {
    return res.status(400).json({ message: "Page must be at least 1" });
  }

  if (limit < 1) {
    return res.status(400).json({ message: "Limit must be at least 1" });
  }

  if (limit > 100) {
    return res
      .status(400)
      .json({ message: "Limit cannot be greater than 100" });
  }

  req.pagination = { page, limit };
  next();
}
