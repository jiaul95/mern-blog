import express from "express";
import { signup,signin,googleAuth,uploadProfileImage,updateUser,deleteUser,signout,refreshToken } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
// const verifyToken = require('../middlewares/auth');


// router.get('/testAuth',verifyToken,(req,res) => {
//     res.status(200).json({
//         message: 'Authenticated user'
//     });
// });


router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(googleAuth);
router.route("/uploadProfileImage").post(uploadProfileImage);
router.route("/update/:userId").put(verifyToken,updateUser);
router.route("/delete/:userId").delete(verifyToken,deleteUser);
router.route("/signout").post(verifyToken,signout);
router.route("/refreshToken").post(refreshToken);


export default router;

