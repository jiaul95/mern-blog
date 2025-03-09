import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";

import errorResponse from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";


const app = express();

const corsOptions = {
    origin: [
      'http://localhost:5173', 
      // 'http://localhost:8000'
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1",authRoute);
app.use("/api/v1/post",postRoute);


app.use(errorResponse);

export default app;