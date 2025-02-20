import express from "express";
const app = express();

app.use(express.json());

app.listen(8000,(err,res)=>{
    if(err) throw err;
    console.log("Server is running on port 8000");
})