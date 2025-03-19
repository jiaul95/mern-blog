import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import axiosInstance from "../../axios/axios";
import {
  dismissImageAlert,
  imageUploadFailure,
  publishPostFailure,
  publishPostStart,
  publishPostSuccess,
  successAlert,
} from "../features/user/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const PostPage = () => {

    const {postSlug} = useParams();

    useEffect(() => {

        console.log("postSlug: " + postSlug);
        
    }, [postSlug])
  
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
     Post Page
    </div>
  );
};
