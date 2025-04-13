import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axios.js";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiArrowNarrowUp } from "react-icons/hi";
import { HiAnnotation } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi";

import {
  postFetchSuccess,
  postFetchFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
  dismissImageAlert,
  commentsFetchFailure,
} from "../features/user/postSlice.js";
import { userFetchFailure } from "../features/user/userSlice.js";

export const DashboardComp = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [posts, setPosts] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = () => {
      axiosInstance
        .get(`/user/getUsers?limit=5`)
        .then((res) => {
          if (res.data.success === true) {
            setUsers(res.data.data.users);
            setTotalUsers(res.data.data.totalUsers);
            setLastMonthUsers(res.data.data.lastMonthUsers);
          } else {
            dispatch(userFetchFailure("Failed to fetch posts!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(userFetchFailure(error.response.data.message));
        });
    };

    const fetchPosts = () => {
      axiosInstance
        .get(`/post/getPosts?limit=5`)
        .then((res) => {
          if (res.data.success === true) {
            setPosts(res.data.data.posts);
            setTotalPosts(res.data.data.totalPosts);
            setLastMonthPosts(res.data.data.lastMonthPosts);
          } else {
            dispatch(postFetchFailure("Failed to fetch posts!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(postFetchFailure(error.response.data.message));
        });
    };

    const fetchComments = () => {
      axiosInstance
        .get(`/comment/getComments?limit=5`)
        .then((res) => {
          if (res.data.success === true) {
            setComments(res.data.data.comments);
            setTotalComments(res.data.data.totalComments);
            setLastMonthComments(res.data.data.lastMonthComments);
          } else {
            dispatch(commentsFetchFailure("Failed to fetch posts!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(commentsFetchFailure(error.response.data.message));
        });
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup
              className="bg-teal-600 text-white rounded-full text-5xl p-3 
                  shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
              <p>{totalComments}</p>
            </div>
            <HiAnnotation
              className="bg-indigo-600 text-white rounded-full text-5xl p-3 
                  shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p>{totalPosts}</p>
            </div>
            <HiDocumentText
              className="bg-lime-600 text-white rounded-full text-5xl p-3 
                  shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
