import User from "../models/user.model.js";
import Post from "../models/post.model.js";

import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js"
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";



// Create uploads directory if not exists
const uploadDir = "uploads/posts";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer Storage for Posts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts"); // Store images in `posts/uploads/`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }).single("postImage");

export const create = async (req, res, next) => {

  // Upload Image First
  upload(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, "Error uploading file"));
    }

    // Authorization Check
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create posts"));
    }

    // return;
    // Extract form data (assuming it’s sent as JSON in FormData)
    const formInput = JSON.parse(req.body.formInput || "{}");
    // const formInput = req.body || "{}";

    // console.log(req.file);
    // console.log(req.body);


    if (!formInput.title || !formInput.content) {
      return next(errorHandler(422, "Please provide all required fields"));
    }
// console.log("formInput",formInput);return;
    // Generate a SEO-friendly slug
    const slug = formInput.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-");

    const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/posts/${req.file.filename}`
    : null;

    try {
      // Create New Post with Image URL (if uploaded)
      const newPost = await Post.create({
        ...formInput,
        slug,
        userId: req.user.id,
        image: imageUrl, 
      });

      if (newPost) {
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message: "Post created successfully",
          data: newPost,
        });
      }
    } catch (error) {
      return next(errorHandler(500, error?.message || "Something went wrong!"));
    }
  });
};



