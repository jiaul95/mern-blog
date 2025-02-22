import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {

    const {username,email,password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(422).json({
            message:"All fields are required",
        });
    }

    const hashPassword = bcrypt.hashSync(password,10);

    const newUser = await User.create({
        username,
        email,
        password:hashPassword
    });

    if(newUser){
        res.status(201).json({
            message:"User created successfully",
            user: newUser,
        });
    }
     
}