import express from "express";
import { create } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.route("/create").post(create);
export default router;

