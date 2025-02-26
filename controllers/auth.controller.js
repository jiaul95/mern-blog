import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js"
import jwt from "jsonwebtoken";

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


