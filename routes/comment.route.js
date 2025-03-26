import express from "express";
import { createComment,getPostComments,likeComment} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.route("/create").post(verifyToken,createComment);
router.route("/getPostComments/:postId").get(verifyToken,getPostComments);
router.route("/likeComment/:commentId").put(verifyToken,likeComment);


export default router;

