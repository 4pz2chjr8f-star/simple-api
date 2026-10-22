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

import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", auth, authorize("admin"), validatePagination, getUsers);

router.post("/", createUser);

router.get("/:id", auth, getUser);

router.put("/:id", auth, updateUser);

router.patch("/:id", auth, patchUser);

router.delete("/:id", auth, deleteUser);

export default router;
