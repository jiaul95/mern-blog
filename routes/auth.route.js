import express from "express";
import { signup,signin,googleAuth } from "../controllers/auth.controller.js";
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


export default router;

