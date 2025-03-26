
import Comment from "../models/comment.model.js";
import errorHandler from "../utils/customError.js";


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


export const getPostComments = async (req, res, next) => {
  
   try {

      const comments = await Comment.find({postId: req.params.postId})
        .sort({ createdAt: -1 });   
        
        res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Comments fetched successfully",
          data: comments,
        });
    } catch (error) {
      next(error);
    }

};



