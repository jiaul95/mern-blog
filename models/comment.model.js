import mongoose from "mongoose";

const {Schema,model} = mongoose;

const commentSchema = new Schema(
    {
        comment:{
            type: String,
            required: true
        },
        postId:{
            type: String,
            required: true
        },
        userId:{
            type: String,
            required: true
        },
        likes: {
            type: Array,
            default: []
        },
        numberOfLikes: {
            type: Number,
            default: 0
        }       
    },
    {
        timestamps:true
    });
const Comment = model("Comment",commentSchema);
export default Comment; 