import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.js"

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
