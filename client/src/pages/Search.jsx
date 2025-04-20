import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  postFetchFailure,
  postFetchStart,
  postFetchSuccess,
  recentPostFetchStart,
} from "../features/user/postSlice";
import axiosInstance from "../../axios/axios";
import { PostCard } from "../components/PostCard";

export const Search = () => {
  const { loading, allPosts } = useSelector((state) => state.post);
  //   const individualPost = useSelector((state) => state.post?.individualPost) || {};
  //   const recentPosts = useSelector((state) => state.post?.recentPosts) || [];
  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [showMore, setShowMore] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "uncategorized";

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = () => {
      const searchQuery = urlParams.toString();

      dispatch(postFetchStart());
      axiosInstance
        .get(`/post/getPosts?${searchQuery}`)
        .then((res) => {
          if (res.data.success === true) {

            res.data.data.posts.length === 9 ? setShowMore(true) : setShowMore(false);
           
            dispatch(postFetchSuccess(res.data.data.posts));
          } else {
            dispatch(postFetchFailure("Failed to fetch more posts!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(postFetchFailure(error.response.data.message));
        });
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if(e.target.id === "searchTerm"){
        setSidebarData({
            ...sidebarData,
            searchTerm: e.target.value,
        });
    }

    if(e.target.id === "sort"){
        const order = e.target.value || "desc";
        setSidebarData({
            ...sidebarData,
            sort: order,
        });
    }

    if(e.target.id === "category"){
        const category = e.target.value || "uncategorized";
        setSidebarData({
            ...sidebarData,
            category,
        });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sidebarData.searchTerm.trim() === "") {
        return;
    }
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  const handleShowMore = () => {
    const numberOfPosts = allPosts.length || 0;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    axiosInstance
      .get(`/post/getPosts?${searchQuery}`)
      .then((res) => {
        if (res.data.success === true) {
          console.log("res.data.data.posts", res.data.data.posts);
          dispatch(postFetchSuccess([...allPosts, ...res.data.data.posts]));
          res.data.data.posts?.length === 9 ? setShowMore(true) : setShowMore(false);
        } else {
          dispatch(postFetchFailure("Failed to fetch more posts!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(postFetchFailure(error.response.data.message));
      });
  }

//   if (loading) {
//     return ( 
//       <div className="flex justify-center items-centermin-h-screen">
//         <Spinner size="xl" />
//       </div>
//     );
//   }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term: </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={
                handleChange
              }
            />
          </div>
          <div className="flex items-center gap-2">
              <lebel className="font-semibold">Sort: </lebel>
              <Select onChange={handleChange} value={sidebarData.sort} id="sort">
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
          </div>

          <div className="flex items-center gap-2">
              <lebel className="font-semibold">Category: </lebel>
              <Select onChange={handleChange} value={sidebarData.category} id="category">
                <option value="uncategorized">Latest</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
                <option value="javascript">JavaScript</option>
              </Select>
          </div>

          <Button type="submit" outline gradientDuoTone="purpleToPink" className="text-gray-500">
            Apply Filters
          </Button>

        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Post Results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
            {
                !loading && allPosts.length === 0 && (<p className="text-xl text-gray-500">
                    No posts found for <span className="font-semibold">{sidebarData.searchTerm}</span>
                </p>)}


            {
                loading && (
                    <p className="text-xl text-gray-500">
                        Loading posts...
                    </p>
                )
            }

            {
                !loading && allPosts && allPosts.length > 0 && allPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))
            }

            {
                showMore && !loading && allPosts.length > 0 && (
                    <button
                      onClick={handleShowMore}
                      className="text-teal-500 text-lg hover:undrline p-7 w-full"
                    >
                      Show more
                    </button>
                )
            }
        </div>

      </div>
    </div>
  );
};
