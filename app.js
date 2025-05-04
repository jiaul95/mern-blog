// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import authRoute from "./routes/auth.route.js";
// import postRoute from "./routes/post.route.js";
// import userRoute from "./routes/user.route.js";
// import commentRoute from "./routes/comment.route.js";
// import errorResponse from "./middlewares/error.middleware.js";
// import cookieParser from "cookie-parser";
// import path from "path";

// const __dirname = path.resolve();


// const app = express();

// const corsOptions = {
//     origin: [
//       'http://localhost:5173', 
//       // 'http://localhost:8000'
//     ],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(morgan('dev'));
// app.use(express.json());
// // app.use("/uploads", express.static("uploads"));
// app.use(express.static(path.join(__dirname, 'uploads')));

// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api/v1",authRoute);
// app.use("/api/v1/post",postRoute);
// app.use("/api/v1/user",userRoute);
// app.use("/api/v1/comment",commentRoute);

// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.use(errorResponse);



// export default app;
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import errorResponse from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 👇 This is the ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: ['https://mernblog.ennovatorz.com'], // add other origins as needed
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// ✅ Sample base route
app.get("/", (req, res) => {
  res.send("==> Your service is live 🎉");
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Mount routes
app.use("/api/v1", authRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/comment", commentRoute);

// Error handler
app.use(errorResponse);

export default app;
