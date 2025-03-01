import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios";
import { imageUploadStart,imageUploadSuccess,imageUploadFailure } from "../features/user/userSlice.js";

export const DashProfile = () =>{

  const {currentUser} = useSelector((state)=>state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();

    console.log("imageFileUrl",imageFileUrl);
    console.log("uploadede image",currentUser.profilePicture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() =>{
    if(imageFile){
        uploadImage();
    }
  },[imageFile]);

    const uploadImage = async () => {
        
        dispatch(imageUploadStart());
        
        const formData = new FormData();
        formData.append("profilePicture", imageFile);
        formData.append("userId", currentUser._id);
        console.log("image uploading",formData);

         axiosInstance.post('/uploadProfileImage', formData,
                    {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        },
                        // onUploadProgress: progressEvent => {
                        // console.log('Upload progress:', Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
                        // }  
                    }
                )
              .then((res) => {
                console.log('res',res.data);
                if(res.data.success === true){        
                    console.log("res",res.data.data); 
                    setImageFileUrl(res.data.data);
                    dispatch(imageUploadSuccess(res.data.data));                
                }
              })
              .catch((error) => {
                console.error('Error Response', error);
                dispatch(imageUploadFailure(error.response.data.message));
        
              });    

    }
    return (
        <div className="max-w-lg max-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4">

                <input type="file" accept="/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"/>
                </div>

                <TextInput  type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
                <TextInput  type="text" id="email" placeholder="email" defaultValue={currentUser.email} />
                <TextInput  type="text" id="password" placeholder="**********" />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>

            </div>
        </div>
    )
}