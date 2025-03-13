import { Alert, Button, Modal, Table} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios.js";
import { postFetchSuccess,postFetchFailure, deletePostStart, deletePostSuccess, deletePostFailure, dismissImageAlert } from "../features/user/postSlice.js";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export const DashPosts = () =>{

    const dispatch = useDispatch();
    const  {currentUser, error: errorMessage} = useSelector((state) => state.user);
    const [showMore,setShowMore] = useState(true);    
    const [showModal,setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const allPosts = useSelector((state) => state.post?.allPosts) || [];   

    // useEffect(() => {
    //     console.log("Updated Posts List:", allPosts.map((p) => p._id));
    // }, [allPosts]);


    const handleShowModal = (postId) => {    
        setShowModal(true);
        setPostIdToDelete(postId);            
    }

    
        
    const handleDeletePost =  async () => {

        setShowModal(false);

        dispatch(deletePostStart());

        await axiosInstance.delete(`/post/deletePost/${postIdToDelete}/${currentUser._id}`)
        .then((res) => {
            if(res.data.success === true){         
                const newData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];

                const updatedPosts = allPosts.filter((post)=>post._id !== postIdToDelete).concat(newData);

                dispatch(deletePostSuccess(res.data.message));
                dispatch(postFetchSuccess(
                    updatedPosts
                ));
            }else
            {
                dispatch(deletePostFailure("Failed to delete profile!"));
            }
        })
        .catch((error) => {
            dispatch(deletePostFailure(error.response.data.message));
        }); 
    

    }



    useEffect(() => {

        const getAllPosts = () =>{
            axiosInstance.get(`/post/getPosts?userId=${currentUser._id}`)
             .then((res) => {
                if(res.data.success === true){         
                    dispatch(postFetchSuccess(res.data.data.posts || []));
                    if(res.data.data.posts?.length < 9){
                        setShowMore(false);
                    }
                }else
                {
                    dispatch(postFetchFailure("Failed to fetch posts!"));
                }
            })
            .catch((error) => {
                console.error('Error Response', error);
                dispatch(postFetchFailure(error.response.data.message));
            });  
        }

        if(currentUser?.isAdmin){
            getAllPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = () =>{
        axiosInstance.get(`/post/getPosts?userId=${currentUser._id}&skip=${allPosts.length}`)
             .then((res) => {
                if(res.data.success === true){         
                    dispatch(postFetchSuccess(
                        [...allPosts, ...res.data.data.posts]
                    ));
                    if(res.data.data.posts?.length || 0 < 9){
                        setShowMore(false);
                    }
                } else
                {
                    dispatch(postFetchFailure("Failed to fetch more posts!"));
                }
            })
            .catch((error) => {
                console.error('Error Response', error);
                dispatch(postFetchFailure(error.response.data.message));
            });
    }



    return (
        <div className="table-auto overflow-x-scroll 
        md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrillbar-thumb-slate-500
        ">
            {currentUser?.isAdmin && allPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>     
                            <Table.HeadCell>Post image</Table.HeadCell>                                      
                            <Table.HeadCell>Post title</Table.HeadCell>                                      
                            <Table.HeadCell>Category</Table.HeadCell>                                      
                            <Table.HeadCell>Delete</Table.HeadCell>                                      
                            <Table.HeadCell>
                                <span>Edit</span>    
                            </Table.HeadCell>   
                        </Table.Head>
                        {
                            allPosts.map((post)=>(    
                                <Table.Body key={post._id} className="divide-y">                            
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt={post.title} 
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                                            <Link to={`/post/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>{post.category}</Table.Cell>
                                        <Table.Cell>
                                            <span className="font-medium text-red-500 
                                        hover:underline cursor-pointer" onClick={()=>handleShowModal(post._id)}>Delete</span>
                                        </Table.Cell>
                                        <Table.Cell className="text-teal-500 hover:underline cursor-pointer">
                                            <Link to={`/update-post/${post._id}`}>
                                                <span>Edit</span>
                                            </Link>                                            
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                
                            ))}
                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm 
                            py-7
                            ">
                                Show more
                            </button>
                          
                        )}
                </>                
            ) : (
                <p>You have no posts yet</p>
            )}
        
            <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your post ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeletePost}>
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