import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { generateAccessToken,generateRefreshToken } from "../utils/jwt.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(422, "All fields are required"));
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "User created successfully",
        data: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(422, "All fields are required"));
  }

  const validateUser = await User.findOne({ email: email });

  if (!validateUser) {
    return next(errorHandler(404, "User not found"));
  }

  const validatePassword = bcrypt.compareSync(password, validateUser.password);

  if (!validatePassword) {
    return next(errorHandler(401, "Invalid credentials"));
  }

  const token = generateAccessToken(validateUser);
  const refreshToken = generateRefreshToken(validateUser);

  validateUser.refreshToken = refreshToken;

  await validateUser.save();

  const { password: pass, ...rest } = validateUser._doc;

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", // True in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    })
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", // True in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    })
    .json({
      success: true,
      statusCode: 200,
      message: "Signed In successfully",
      data: rest,
    });
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  const findUser = await User.findOne({ email });

  if (findUser) {
    
    const token = generateAccessToken(findUser);
    const refreshToken = generateRefreshToken(findUser);

    const { password, ...rest } = findUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: process.env.NODE_ENV === "production", // True in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production", // True in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
      })
      .json({
        success: true,
        statusCode: 200,
        message: "Signed In successfully",
        data: rest,
      });
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = await User.create({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashPassword,
      profilePicture: googlePhotoUrl,
    });

    if (newUser) {
     
      const token = generateAccessToken(newUser);

      const refreshToken = generateRefreshToken(newUser);

      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          secure: process.env.NODE_ENV === "production", // True in production
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          path: "/",
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          // maxAge: 2 * 60 * 1000,
          secure: process.env.NODE_ENV === "production", // True in production
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          path: "/",
        })
        .json({
          success: true,
          statusCode: 200,
          message: "Signed In successfully",
          data: rest,
        });
    }
  }
};

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }).single("profilePicture");

// File Upload Handler
export const uploadProfileImage = async (req, res, next) => {
  // console.log(req.body);return;

  // Create uploads directory if not exists
  const uploadDir = "uploads/profileImage";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  upload(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, "File upload failed!"));
    }

    try {
      const { userId } = req.body;
      if (!userId) {
        // return res.status(400).json({ error: "User ID is required!" });
        next(errorHandler(400, "User ID is required!"));
      }

      let imageUrl =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Default image

      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      }

      // Update the User's profilePicture field
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true }
      );

      if (!updatedUser) {
        // return res.status(404).json({ error: "User not found!" });
        return next(errorHandler(400, "User not found!"));
      }

      // res.status(200).json({ message: "Profile picture updated successfully!", profilePicture: updatedUser.profilePicture });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Profile Image Uploaded successfully",
        data: updatedUser,
      });
    } catch (error) {
      // res.status(500).json({ error: "Error updating user profile picture", details: error });
      return next(errorHandler(500, "Error updating user profile picture"));
    }
  });
};

// update user
export const updateUser = async (req, res, next) => {
  const userId = req.params.userId;

  // console.log(req.params.userId);return;

  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are forbidden to update user profile"));
  }

  if (req.body.password && req.body.password.length < 6) {
    return next(
      errorHandler(400, "Password should be at least 6 characters long")
    );
  }

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (
    (req.body.username && req.body.username.length < 7) ||
    req.body.username > 20
  ) {
    return next(
      errorHandler(400, "Username must be between 7 and 20 characters")
    );
  }

  if (req.body.username && req.body.username.includes(" ")) {
    return next(errorHandler(400, "Username cannot contain spaces"));
  }

  if (req.body.username !== req.body.username.toLowerCase()) {
    return next(errorHandler(400, "Username must be in lowercase"));
  }

  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          // profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    // console.log("updatedUser", updatedUser);
    const { password, ...rest } = updatedUser._doc;

    if (updatedUser) {
      res.status(200).json({
        success: true,
        statusCode: 201,
        message: "User Updated successfully",
        data: rest,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const deleteUser = await User.findByIdAndDelete(userId);

    if (deleteUser) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User Deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {

    const user = await User.findOne({refreshToken: req.cookies.refreshToken});

    if(user){
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200).json({
      success: true,
      statusCode: 200,
      message: "User has been signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(401).json({ success: false, message: "Unauthenticated" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/" });
      return res.status(403).json({ success: false, message: "Forbidden or token mismatch" });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 1 minute for testing
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });

  } catch (err) {
    console.error("❌ Refresh token error:", err);
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};
