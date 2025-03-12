import { Button, Table} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axios.js";
import { postFetchSuccess,postFetchFailure } from "../features/user/postSlice.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";


export const DashPosts = () =>{

    const dispatch = useDispatch();
    
      const  {currentUser} = useSelector((state) => state.user);
      const  {allPosts} = useSelector((state) => state.post);
      const [showMore,setShowMore] = useState(true);
      console.log('posts length',allPosts);


    useEffect(() => {

        const getAllPosts = () =>{
            axiosInstance.get(`/post/getPosts?userId=${currentUser._id}`)
             .then((res) => {
                if(res.data.success === true){         
                    dispatch(postFetchSuccess(res.data.data.posts));
                    if(res.data.data.posts.length > 9){
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

        if(currentUser.isAdmin){
            getAllPosts();
        }
    }, [currentUser._id]);


    return (
        <div className="table-auto overflow-x-scroll 
        md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrillbar-thumb-slate-500
        ">
            {currentUser.isAdmin && allPosts.length > 0 ? (
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
                                        <Table.Cell className="font-medium text-red-500 
                                        hover:underline cursor-pointer">
                                            <span>Delete</span>
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
                            <Button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm 
                            py-7
                            ">
                                Show more
                            </Button>
                          
                        )}
                </>                
            ) : (
                <p>You have no posts yet</p>
            )}
        </div>
    )
}