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


export const CallToAction = () =>{
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500
            justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl">Want to learn more about Javascript ?</h2>
                <p className="text-gray-500 my-2">Checkout these resources with 100 Javascript Projects</p>
                <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
                    <a href="https://www.100jsprojects.com/" target="_blank" rel="noopener noreferrer">
                        100 Javascript Projects
                    </a>
                </Button>
            </div>

            <div className="p-7 flex-1">
                <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" 
                alt="" />
            </div>
        </div>

       
    )
}