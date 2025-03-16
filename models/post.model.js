import mongoose from "mongoose";

const {Schema,model} = mongoose;

const postSchema = new Schema(
    {
        userId:{
            type: String,
            required: true
        },
        content:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true,
            unique: true
        },

        image:{
            type: String,
            default: "https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg?t=st=1741528350~exp=1741531950~hmac=7ad4d6f00527aa1233f03b81ff769204939b3f28b9dd3f92e4ff61f2ba6f6819&w=996"
        },
        category:{
            type: String,
            default: 'uncategorized'
        },
        slug: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps:true
    });
const Post = model("Post",postSchema);
export default Post; 