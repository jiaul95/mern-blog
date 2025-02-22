import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

import authRoute from "./routes/auth.route.js";

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

app.use("/api/v1",authRoute);

export default app;