import express from "express";
import { signup } from "../controllers/auth.controller.js";
const router = express.Router();
// const verifyToken = require('../middlewares/auth');


// router.get('/testAuth',verifyToken,(req,res) => {
//     res.status(200).json({
//         message: 'Authenticated user'
//     });
// });

router.route("/signup").post(signup);

export default router;

