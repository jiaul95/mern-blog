import { Alert, Button, Modal, TextInput } from "flowbite-react";
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
        updateUserSuccess, 
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailure ,
        signoutUserSuccess
    } from "../features/user/userSlice.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";


export const DashProfile = () =>{

  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();
  const {
        currentUser,
        updateUserSuccess:updateSuccessMessage,
        error: errorMessage,
        imageFileUploadProgress,
        loading       
    } = useSelector((state) => state.user);
  const [formInput,setFormInput] = useState({});
    const [showModal,setShowModal] = useState(false);
    const handleChange = (e) => {   
        setFormInput({...formInput, [e.target.id]: e.target.value });
    }

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
            }else
            {
                dispatch(updateFailure("Failed to update profile!"));
            }
        })
        .catch((error) => {
            console.error('Error Response', error);
            dispatch(updateFailure(error.response.data.message));
        });    
       
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

    const handleDeleteUser = async () => {

        setShowModal(false);

        dispatch(deleteUserStart());

        await axiosInstance.delete(`/delete/${currentUser._id}`)
        .then((res) => {
            if(res.data.success === true){         
                dispatch(deleteUserSuccess(res.data.message));
            }else
            {
                dispatch(deleteUserFailure("Failed to delete profile!"));
            }
        })
        .catch((error) => {
            dispatch(deleteUserFailure(error.response.data.message));
        }); 
    }


    const handleSignOut = async () => {
        await axiosInstance.post(`/signout`)
        .then((res) => {
            if(res.data.success === true){         
                dispatch(signoutUserSuccess());
            }
        })
        .catch((error) => {
           console.log("error",error);
        }); 
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
                    // console.log("res",res.data.data); 
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
                <Button className="cursor-pointer" type="submit" gradientDuoTone="purpleToBlue" 
                outline disabled={loading}>
                    {loading ? "Loading..." : "Update" }
                </Button>

                {
                    currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                            <Button type="button" className="w-full cursor-pointer" gradientDuoTone="purpleToPink" 
                            outline 
                            // onClick={handleCreatePost}
                            >
                                Create Post
                            </Button>
                        </Link>
                    )
                }

            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete Account</span>
                <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
            </div>
            {updateSuccessMessage && 
                <Alert className="mt-4" color="success" onDismiss={() => dispatch(dismissImageAlert()) }>
                    {updateSuccessMessage}
                </Alert>                    
            } 

            <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>No,cancel</Button>
                        </div>
                            {
                                errorMessage && (
                                    <Alert className="mt-2" color="failure" onDismiss={() => dispatch(dismissImageAlert()) }>
                                        {errorMessage}
                                    </Alert>
                                )
                            }
                        
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}