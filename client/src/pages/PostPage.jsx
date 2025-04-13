import { Button, Spinner } from "flowbite-react";
import { useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axiosInstance from "../../axios/axios";
import {
  individualPostFetchStart,
  individualPostFetchSuccess,
  individualPostFetchFailure,
  recentPostFetchStart,
  recentPostFetchSuccess,
  recentPostFetchFailure,
} from "../features/user/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";
import { CommentSection } from "../components/CommentSection";
import { PostCard } from "../components/PostCard";

export const PostPage = () => {

  const { postSlug } = useParams();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.post);
  const individualPost = useSelector((state) => state.post?.individualPost) || {};
  const recentPosts = useSelector((state) => state.post?.recentPosts) || {};

  // const [recentPosts, setRecentPosts] = useState(null);
  
  useEffect(() => {
    dispatch(individualPostFetchStart());
    axiosInstance
      .get(`/post/getPosts?slug=${postSlug}`)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(individualPostFetchSuccess(res.data.data.posts[0]));
        } else {
          dispatch(individualPostFetchFailure("Failed to fetch more posts!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(individualPostFetchFailure(error.response.data.message));
      });
  }, [postSlug]);

  useEffect(() => {
    dispatch(recentPostFetchStart());
    axiosInstance
      .get("/post/getPosts?limit=3")
      .then((res) => {
        if (res.data.success === true) {
          console.log("recent post", res.data.data.posts);

          dispatch(recentPostFetchSuccess(res.data.data.posts));
        } else {
          dispatch(recentPostFetchFailure("Failed to fetch more posts!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(recentPostFetchFailure(error.response.data.message));
      });
    
  },[]);

  
  if (loading){
    return (
      <div className="flex justify-center items-centermin-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1
        className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto
    lg:text-4xl
    "
      >
        {individualPost && individualPost.title}
      </h1>

      <Link
        to={`/search?category=${individualPost && individualPost.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {individualPost && individualPost.category}
        </Button>
      </Link>

      <img
        src={individualPost && individualPost.image}
        alt={individualPost && individualPost.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs">
        <span>
          {individualPost &&
            new Date(individualPost.createdAt).toLocaleDateString()}
        </span>
        
        <span className="italic">
          {individualPost?.content
            ? (individualPost.content.length / 1000).toFixed(0)
            : "0"}{" "}
          mins read
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{
          __html: individualPost && individualPost.content,
        }}
      ></div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />        
      </div>

      <CommentSection postId={individualPost._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recentPosts && 
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}            
        </div>
      </div>

    </main>
  );
  
}
