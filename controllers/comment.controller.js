import Comment from "../models/comment.model.js";
import errorHandler from "../utils/customError.js";

export const createComment = async (req, res, next) => {
  try {
    const { comment, postId, userId } = req.body;

    if (userId != req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = await Comment.create({
      comment,
      postId,
      userId,
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
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Comment liked successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId != req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    const editComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { comment: req.body.comment },
      { new: true }
    );

    if (editComment) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Comment edited successfully",
        data: editComment,
      });
    }
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId != req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }

    const deleteComment = await Comment.findByIdAndDelete(req.params.commentId);

    if (deleteComment) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Comment deleted successfully",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};


export const getComments = async (req, res, next) => {
  if(!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get comments"));
  }
  try {

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order == "desc" ? -1 : 1;
    const comments = await Comment.find({}).sort({ createdAt: order }).skip(offset).limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Comments fetched successfully",
      data: {comments, totalComments, lastMonthComments},
    });
  } catch (error) {
    next(error);
  }
}