import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";



export const createComment = async (req, res, next) => {
    try {

      const { comment,postId,userId } = req.body;

      if(userId != req.user.id){
        return next(errorHandler(403, "You are not allowed to create this comment"));        
      }      

      const newComment = await Comment.create({
        comment,
        postId,
        userId
      });

      if (newComment) {
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message: "Comment created successfully",
          data: newComment,
        });
      }
    } catch (error) {
      return next(errorHandler(500, error?.message || "Something went wrong!"));
    }
  
};


