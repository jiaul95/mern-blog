import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider,getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axiosInstance from "../../axios/axios";

import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../features/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hanldeGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        
        provider.setCustomParameters({
            propmt: 'select_account'
          });


            const resultsFromGoogleAuth = await signInWithPopup(auth,provider);
            console.log("Successfully signed in with Google: ", resultsFromGoogleAuth);
            const googleOAuthResponse = {
                email: resultsFromGoogleAuth.user.email,
                name: resultsFromGoogleAuth.user.displayName,
                googlePhotoUrl: resultsFromGoogleAuth.user.photoURL              
            };

            axiosInstance.post("/google",googleOAuthResponse)
            .then((res) => {
              // console.log('res',res.data);
              if(res.data.success === true){         
                  dispatch(signInSuccess(res.data.data));
                  navigate('/');
              }
            })
            .catch((error) => {
              console.error('Error Response', error);
              dispatch(signInFailure(error.response.data.message));
    
            });    
            

    }

    return (
        <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={hanldeGoogleAuth}>
                <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
                Sign in with Google           
        </Button>
    )
}