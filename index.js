import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: './.env',
});

const DB = process.env.DATABASE.replace('<password>',process.env.PASSWORD);

mongoose.connect(DB).then(()=>{
    console.log('Connection Established Successfully!', '')
})
.catch((err)=>{
    console.log("Error connecting to DB",err);
});

const port = process.env.PORT || 8000;
app.listen(port,(err,res)=>{
    if(err) throw err;
    console.log("Server is running on port 8000");
})