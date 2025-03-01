import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js"
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

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

    next(errorHandler(422,"All fields are required"));
   
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

  if (!email ||
    !password ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(422,"All fields are required"));   
  }

  const validateUser = await User.findOne({email:email});

  if(!validateUser){
   return next(errorHandler(404, "User not found"));
  }

  const validatePassword = bcrypt.compareSync(password, validateUser.password);

  if(!validatePassword){
    return next(errorHandler(401, "Invalid credentials"));
  }

  const token = jwt.sign({
    id: validateUser._id
  },process.env.JWT_SECRET);
  
  const {password:pass, ...rest} = validateUser._doc;

  res.status(200).cookie('access_token', token,{
    httpOnly: true
  }).json({
    success: true,
    statusCode: 200,
    message: "Signed In successfully",
    data: rest,
})
  
  
};


export const googleAuth = async (req,res,next) => {
  const {email,name,googlePhotoUrl} = req.body;

  const findUser = await User.findOne({email});

  if(findUser){
    const token = jwt.sign({id:findUser._id},process.env.JWT_SECRET);
    const {password,...rest} = findUser._doc;

    res.status(200).cookie('access_token', token,{
      httpOnly: true
    }).json({
        success: true,
        statusCode: 200,
        message: "Signed In successfully",
        data: rest,
    });
  }else{
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = await User.create({
      username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
      email,
      password: hashPassword,
      profilePicture: googlePhotoUrl
    });

    if(newUser){
      const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
      const {password,...rest} = newUser._doc;
      res.status(200).cookie('access_token', token,{
        httpOnly: true
      }).json({
          success: true,
          statusCode: 200,
          message: "Signed In successfully",
          data: rest,
      });
    }
  }

}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage }).single("profilePicture");


// File Upload Handler
export const uploadProfileImage = async (req, res,next) => {
  // console.log(req.body);return;

  // Create uploads directory if not exists
  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log("error",err);
      // return res.status(500).json({ error: "File upload failed!", details: err });
      next(errorHandler(500,"File upload failed!"));

    }

    try {
      const {userId} = req.body; 
      console.log("userId: " + userId);
      if (!userId) {
        // return res.status(400).json({ error: "User ID is required!" });
        next(errorHandler(400,"User ID is required!"));
      }

      let imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Default image

      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      // Update the User's profilePicture field
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true }
      );

      if (!updatedUser) {
        // return res.status(404).json({ error: "User not found!" });
        next(errorHandler(400,"User not found!"));        
      }

      // res.status(200).json({ message: "Profile picture updated successfully!", profilePicture: updatedUser.profilePicture });
      
      res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Profile Image Uploaded successfully",
          data: updatedUser
      });      
    
    } catch (error) {
      // res.status(500).json({ error: "Error updating user profile picture", details: error });
      next(errorHandler(500,"Error updating user profile picture"));          
    }
  });
};



