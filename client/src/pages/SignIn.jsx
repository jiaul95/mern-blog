import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

import axiosInstance from "../../axios/axios.js";

import { signInStart,signInSuccess,signInFailure } from "../features/user/userSlice.js";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import { OAuth } from "../components/OAuth.jsx";

export const SignIn = () => {

  const  [formData,setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error: errorMessage,loading} = useSelector((state) => state.user);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({...formData,[e.target.id]:e.target.value});
  }


  const handleSubmit = (e) => {
      e.preventDefault();      
      dispatch(signInStart());

      if(!formData.email || !formData.password) {       
        dispatch(signInFailure("All fields are required!"));
        return;
      }    
      axiosInstance.post('/signin', formData)
      .then((res) => {
        console.log('res',res.data);
        if(res.data.success === true){         
          dispatch(signInSuccess(res.data.data));
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Error Response', error);
        dispatch(signInFailure(error.response.data.message));

      });    
  }

  return (

    <div className="min-h-screen mt-20">
      
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5"> 
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl"> 
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500
            via-purple-500 to-pink-500 rounded-lg text-white"> Jiauls </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is demo project. You can sign up with your email and password or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              <div className="">
                <Label value="Your email" />
                <TextInput type="text" placeholder="Email" id="email" onChange={handleChange} />
              </div>
              <div className="">
                <Label value="Your password" />
                <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
              </div>
              <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading} style={{cursor:"pointer"}}>

                  {
                  loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                    ) :"Sign In"
                  }
              </Button>

              <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Do not have an account?</span> <Link to="/sign-up" className="text-blue-500">Sign Up</Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">  
              {errorMessage}
            </Alert>
          )}

        </div>
      </div>
    </div>
  )
}
