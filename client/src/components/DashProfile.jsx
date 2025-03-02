import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios";
import { imageUploadStart,
        imageUploadSuccess,
        imageUploadFailure,
        dismissImageAlert,
        uploadProgressStart,
        uploadProgressReset,
        updateStart,
        updateSuccess,
        updateFailure,
        updateUserSuccess
    } from "../features/user/userSlice.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const DashProfile = () =>{

  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();
  const {currentUser,updateUserSuccess:updateSuccessMessage,error: errorMessage,imageFileUploadProgress} = useSelector((state) => state.user);
  const [formInput,setFormInput] = useState({});

    // console.log("imageFileUrl",imageFileUrl);
    // console.log("uploadede image",currentUser.profilePicture);

    const handleChange = (e) => {
        setFormInput({...formInput, [e.target.id]: e.target.value });
    }

    console.log("formInput",formInput);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(Object.keys(formInput).length === 0) {           
            return;
        }

        console.log("form submitted", formInput);

        dispatch(updateStart());

        axiosInstance.put(`/update/${currentUser._id}`, formInput)
        .then((res) => {
        console.log('res',res.data);
        if(res.data.success === true){         
            dispatch(updateSuccess(res.data.data));
            dispatch(updateUserSuccess("Profile Updated successfully!"));
        }
        })
        .catch((error) => {
            console.error('Error Response', error);
            dispatch(updateFailure(error.response.data.message));
        });    

        // try {
            
        // } catch (error) {
            
        // }
       
    }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if(file.size > 2 * 1024 * 1024){    
        dispatch(imageUploadFailure("File size should not exceed 2MB!"))        
        setImageFile(null);
        setImageFileUrl(null);
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
                            console.log("percentCompleted",percentCompleted);
                            dispatch(uploadProgressStart(percentCompleted));
                        }  
                    }
                )
              .then((res) => {
                console.log('res',res.data);
                if(res.data.success === true){        
                    console.log("res",res.data.data); 
                    setImageFileUrl(res.data.data.profilePicture);
                    setFormInput({...formInput,profilePicture: res.data.data.profilePicture}); 
                    dispatch(imageUploadSuccess(res.data.data));   
                    setTimeout(() => {
                        dispatch(uploadProgressReset());        
                    }, 500); 

                    // console.log("formInput",formInput);

                }
              })
              .catch((error) => {
                console.error('Error Response', error);
                dispatch(imageUploadFailure(error.response.data.message));  
                dispatch(uploadProgressReset());    
                setImageFile(null);
                setImageFileUrl(null);    
              });    

    }
    return (
        <div className="max-w-lg max-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                <input type="file" accept="/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
                    {imageFileUploadProgress > 0 && imageFileUploadProgress < 100 &&
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
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" 
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                    ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}` }
                    />
                </div>

                {errorMessage && 
                    <Alert color="failure" onDismiss={() => dispatch(dismissImageAlert()) }>
                        {errorMessage}
                    </Alert>
                } 

                <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput  type="text" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput  type="password" id="password" placeholder="**********" onChange={handleChange} />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
            {updateSuccessMessage && 
                <Alert color="success" onDismiss={() => dispatch(dismissImageAlert()) }>
                    {updateSuccessMessage}
                </Alert>                    
            } 
        </div>
    )
}