import express from "express";

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/userController.js";

import { validatePagination } from "../middleware/pagination.js";

const router = express.Router();

router.get("/", validatePagination, getUsers);

router.post("/", createUser);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.patch("/:id", patchUser);

router.delete("/:id", deleteUser);

export default router;
