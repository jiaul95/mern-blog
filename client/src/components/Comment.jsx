import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export const Comment = ({ comment, onLike, onEdit }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);
  const [error, setError] = useState("");
  

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.comment);
  };

  const handleSave = () => {
    const formData = {
      comment: editedComment,
    };

    axiosInstance
      .put(`/comment/editComment/${comment._id}`, formData)
      .then((res) => {
        if (res.data.success === true) {          
          setIsEditing(false);
          onEdit(comment,editedComment);
        } else {
          setError("Failed to update comment!");
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        setError(error.response.data.message);
      });

  };

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
            {user ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className="mb-2 w-full rounded-md p-2 focus:outline-none"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />

            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => setIsEditing(false)}
                outline
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.comment}</p>
            <div
              className="flex items-center pt-2 text-xs
        border-t dark:border-gray-700 max-w-fit gap-2"
            >
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 cursor-pointer hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                } `}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 cursor-pointer hover:text-blue-500"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
