import express from "express";
import { create,getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.route("/create").post(verifyToken,create);
router.route("/getPosts").get(verifyToken,getPosts);

export default router;

