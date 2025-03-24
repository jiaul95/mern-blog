import { Alert, Button, Textarea} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios.js";
import { createCommentStart,createCommentSuccess,createCommentFailure,successAlert,dismissImageAlert
    } from "../features/user/postSlice.js";
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";
import { Comment } from "./Comment.jsx";


export const CommentSection = ({postId}) =>{

    const {currentUser} = useSelector(state=>state.user);
    const [comment,setComment] = useState(''); 
    const [comments,setComments] = useState(''); 

    const dispatch = useDispatch();
    const {        
        error: errorMessage
      } = useSelector((state) => state.post);
    

    const handleSubmit = (e) =>{
        e.preventDefault();

        if(comment.length > 200){
            return;
        }

        const formData = {
            comment: comment,
            postId: postId,
            userId: currentUser._id,
        }

        dispatch(createCommentStart());        

         axiosInstance
              .post(`/comment/create`, formData, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((res) => {
                // console.log("res", res.data);
                if (res.data.success === true) {
                //   dispatch(createCommentSuccess(res.data.data));
                //   dispatch(successAlert(res.data.message));
                  setComments([res.data.data.comment, ...comments]);
                  setComment("");

                }
                // else {
                //   dispatch(createCommentFailure("Failed to update profile!"));
                // }
              })
              .catch((error) => {
                console.error("Error Response", error);
                dispatch(createCommentFailure(error.response.data.message));
              });

    };

    useEffect(() => {
        const getAllUsers = () => {
             axiosInstance
               .get(`/comment/getPostComments/${postId}`)
               .then((res) => {
                 if (res.data.success === true) {
                    setComments(res.data.data.comments);
                
                //    dispatch(userFetchSuccess(res.data.data.users || []));
                //    if (res.data.data.users?.length < 9) {
                //      setShowMore(false);
                //    }
                //  } else {
                //    dispatch(userFetchFailure("Failed to fetch users!"));
                 }
               })
               .catch((error) => {
                 console.error("Error Response", error);
                //  dispatch(userFetchFailure(error.response.data.message));
               });
           };

        getAllUsers();
       
    },[postId]);

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
            )}
            
            {currentUser && (
                <form className="border border-teal-500 rounded-md p-3" onSubmit={handleSubmit}>
                    <Textarea 
                        placeholder="Add a comment..."
                        rows='3'
                        maxLength='200'
                        onChange={(e)=>setComment(e.target.value)}
                        value={comment}
                    /> 
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone="purpleToBlue" type="submit">
                            Submit
                        </Button>
                    </div>

                    {errorMessage && (
                        <Alert
                        className="mt-5"
                        color="failure"
                        onDismiss={() => dispatch(dismissImageAlert())}
                        >
                        {errorMessage}
                        </Alert>
                    )}                    
                </form>
            )}
            {comments.length === 0 ? (
                <p className="text-sm my-5 text-gray-500 mt-5">No comments yet!</p>
            )
            :(
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((comment)=>(
                        <Comment key={comment._id} 
                        comment={comment}
                        />
                    ))}
                </>
            )}


        </div>

       
    );
}