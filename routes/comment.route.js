import express from "express";
import { createComment,getPostComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.route("/create").post(verifyToken,createComment);
router.route("/getPostComments/:postId").get(verifyToken,getPostComments);

export default router;

