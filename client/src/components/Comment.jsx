import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import moment from "moment";

export const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = () => {
      axiosInstance
        .get(`/user/${comment.userId}`)
        .then((res) => {
          if (res.data.success === true) {
            setUser(res.data.data.user);
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
        });
    };

    getUser();
  }, [comment]);

  return (
    <div>
      <div className="">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>

      <div className="">
        <div className="font-bold mr-1 text-xs truncate gap-1">
          <span>{user ? `@${user.username}` : "anonymous user"}</span>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};
