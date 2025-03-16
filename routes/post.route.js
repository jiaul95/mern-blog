import express from "express";
import {
  create,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.route("/create").post(verifyToken, create);
router.route("/getPosts").get(verifyToken, getPosts);
router.route("/deletePost/:postId/:userId").delete(verifyToken, deletePost);
router.route("/updatePost/:postId/:userId").put(verifyToken, updatePost);

export default router;
