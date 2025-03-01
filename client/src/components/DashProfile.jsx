import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios";
import { imageUploadStart,imageUploadSuccess,imageUploadFailure,dismissImageAlert,uploadProgressStart,uploadProgressReset } from "../features/user/userSlice.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const DashProfile = () =>{

  const {currentUser} = useSelector((state)=>state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
//   const [imageFileUploadError,setImageFileUploadError] = useState(null);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();
  const {error: errorMessage,imageFileUploadProgress} = useSelector((state) => state.user);


    console.log("imageFileUrl",imageFileUrl);
    console.log("uploadede image",currentUser.profilePicture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if(file.size > 2 * 1024 * 1024){    
        dispatch(imageUploadFailure("File size should not exceed 2MB!"));
        return;        
    }

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

        dispatch(uploadProgressStart(0));
        
        const formData = new FormData();
        formData.append("profilePicture", imageFile);
        formData.append("userId", currentUser._id);
        console.log("image uploading",formData);

         axiosInstance.post('/uploadProfileImage', formData,
                    {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round(progressEvent.loaded / progressEvent.total * 100);
                            dispatch(uploadProgressStart(percentCompleted));
                        }  
                    }
                )
              .then((res) => {
                console.log('res',res.data);
                if(res.data.success === true){        
                    console.log("res",res.data.data); 
                    setImageFileUrl(res.data.data.profilePicture);
                    dispatch(imageUploadSuccess(res.data.data));   
                    setTimeout(() => {
                        dispatch(uploadProgressReset());        
                    }, 500); 
                }
              })
              .catch((error) => {
                console.error('Error Response', error);
                dispatch(imageUploadFailure(error.response.data.message));  
                dispatch(uploadProgressReset());        
              });    

    }
    return (
        <div className="max-w-lg max-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4">

                <input type="file" accept="/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
                    {imageFileUploadProgress && 
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress || 0}%`} strokeWidth={5} 
                        style={{ 
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62,152,199,${imageFileUploadProgress/100})`,
                            }
                        }}
                        />
                    }
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"/>
                </div>

                {errorMessage && 
                    <Alert color="failure" onDismiss={() => dispatch(dismissImageAlert()) }>
                        {errorMessage}
                    </Alert>
                } 

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