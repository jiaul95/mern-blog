import jwt from "jsonwebtoken";
import errorHandler from "../utils/customError.js"

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandler(401,"Unauthorized"));
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decodedUser)=>{      
       
        if(err){
            return next(errorHandler(401 ,"Unauthorized"));
        }
        req.user = decodedUser;
        console.log("user",req.user);
        next();
    });
}