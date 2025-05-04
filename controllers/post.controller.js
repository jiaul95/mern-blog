import User from "../models/user.model.js";
import Post from "../models/post.model.js";

import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js";
import jwt from "jsonwebtoken";
import multer from "multer";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create uploads directory if not exists
// const uploadDir = "uploads/posts";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }


// Fix for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads", "posts");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created upload directory:", uploadDir);
}

// Configure Multer Storage for Posts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store images in `posts/uploads/`
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
      ? `${req.protocol}://${req.get("host")}/uploads/posts/${
          req.file.filename
        }`
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

export const getPosts = async (req, res, next) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order == "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: order })
      .skip(offset)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const date = new Date();

    const oneMonthsAgo = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      date.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthsAgo },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Posts fetched successfully",
      data: {
        posts,
        totalPosts,
        lastMonthPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }

  try {
    const deletePost = await Post.findByIdAndDelete(req.params.postId);

    if (deletePost) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Post deleted successfully",
        data: deletePost,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {  
  upload(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, "Error uploading file"));
    }

    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }
    const formInput = JSON.parse(req.body.formInput || "{}");

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/posts/${
          req.file.filename
        }`
      : null;

    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: formInput.title,
            content: formInput.content,
            category: formInput.category,
            ...(imageUrl && { image: imageUrl }),
          },
        },
        { new: true }
      );

      if (updatedPost) {
        res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Post updated successfully",
          data: updatedPost,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
    } catch (error) {
      return next(errorHandler(500, error?.message || "Something went wrong!"));
    }
  });
};

