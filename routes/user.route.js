import express from "express";
import {
  getUsers,
  deleteUser
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.route("/getUsers").get(verifyToken, getUsers);
router.route("/deleteUser/:userId").delete(verifyToken, deleteUser);

export default router;
