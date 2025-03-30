import express from "express";
import { createComment,getPostComments,likeComment,editComment,deleteComment} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.route("/create").post(verifyToken,createComment);
router.route("/getPostComments/:postId").get(verifyToken,getPostComments);
router.route("/likeComment/:commentId").put(verifyToken,likeComment);
router.route("/editComment/:commentId").put(verifyToken,editComment);
router.route("/deleteComment/:commentId").delete(verifyToken,deleteComment);




export default router;

