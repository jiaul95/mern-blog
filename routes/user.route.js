import express from "express";
import { test } from "../controllers/user.controller.js";
const router = express.Router();
// const verifyToken = require('../middlewares/auth');


// router.get('/testAuth',verifyToken,(req,res) => {
//     res.status(200).json({
//         message: 'Authenticated user'
//     });
// });

router.route("/test").get(test);

export default router;

