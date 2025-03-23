import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios.js";
import { imageUploadStart,
        imageUploadSuccess,
        imageUploadFailure,
        dismissImageAlert,
        uploadProgressStart,
        uploadProgressReset,
        updateStart,
        updateSuccess,
        updateFailure,
        updateUserSuccess, 
        deleteAdminUserStart,
        deleteAdminUserSuccess,
        deleteAdminUserFailure ,
        signoutUserSuccess
    } from "../features/user/userSlice.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";


export const CommentSection = ({postId}) =>{

    const {currentUser} = useSelector(state=>state.user);

    return (
        <div className="max-w-2xl max-auto w-full p-3">
            {
            currentUser ? 
            (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img className="h-5 w-5 object-cover rounded-full" src={currentUser.profilePicture} alt="" />
                    <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                        @{currentUser.username}
                    </Link>
                </div>
            )
            :
            (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be signed in to comment.
                    <Link className="text-blue-500 hover:underline" to={'/sign-in'}>Sign In</Link>
                </div>
            )
            
            }
        </div>

       
    )
}