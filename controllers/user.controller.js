import User from "../models/user.model.js";
import errorHandler from "../utils/customError.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export const getUsers = async (req, res, next) => {
  try {

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to see users"));
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order == "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ updatedAt: order })
      .skip(offset)
      .limit(limit);

    // const usersWithoutPassword = users.map((user)=>{
    //   const {password,...rest} = user._doc;
    // });

    const totalUsers = await User.countDocuments();

    const date = new Date();

    const oneMonthsAgo = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      date.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthsAgo },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Users fetched successfully",
      data: {
        users,
        totalUsers,
        lastMonthUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);

    if (deleteUser) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
        data: deleteUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

