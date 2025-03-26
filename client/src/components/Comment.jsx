import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import moment from "moment";

export const Comment = ({ comment }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      if (!comment?.userId) return;

      try {
        const res = await axiosInstance.get(`/user/${comment.userId}`);
        if (res.data.success) {
          setUser(res.data.data.user);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    getUser();
  }, [comment.userId]);

  if (!user || !comment?.comment) return null;

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}`: "Anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
        </div>
        <div className="text-gray-500 pb-2">{comment.comment}</div>
      </div>
    </div>
  );
};
