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

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, validatePagination, getUsers);

router.post("/", createUser);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.patch("/:id", patchUser);

router.delete("/:id", deleteUser);

export default router;
