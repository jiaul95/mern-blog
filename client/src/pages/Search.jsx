import { Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  postFetchFailure,
  postFetchStart,
  postFetchSuccess,
  recentPostFetchStart,
} from "../features/user/postSlice";
import axiosInstance from "../../axios/axios";

export const Search = () => {
  const { loading, allPosts } = useSelector((state) => state.post);
  //   const individualPost = useSelector((state) => state.post?.individualPost) || {};
  //   const recentPosts = useSelector((state) => state.post?.recentPosts) || [];

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

  if (loading) {
    return (
      <div className="flex justify-center items-centermin-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label>Search Term: </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              onChange={
                handleChange
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};
