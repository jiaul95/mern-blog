import mongoose from "mongoose";

const {Schema,model} = mongoose;

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        imageName: String,
        profilePicture:{
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps:true
    });
const User = model("User",userSchema);
export default User; 