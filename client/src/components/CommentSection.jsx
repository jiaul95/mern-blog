import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axios.js";
import { dismissImageAlert } from "../features/user/postSlice.js";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { Comment } from "./Comment.jsx";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [showModal,setShowModal] = useState(false);
  const [commentToDelete,setCommentToDelete] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (commentInput.length > 200) {
      return;
    }

    const formData = {
      comment: commentInput,
      postId: postId,
      userId: currentUser._id,
    };

    axiosInstance
      .post(`/comment/create`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setComments([res.data.data, ...comments]);
          setCommentInput("");
        } else {
          setError("Failed to update profile!");
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    const getPostComments = () => {
      axiosInstance
        .get(`/comment/getPostComments/${postId}`)
        .then((res) => {
          if (res.data.success === true) {
            setComments(res.data.data);
          } else {
            setError("Failed to fetch users!");
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          setError(error.response.data.message);
        });
    };

    getPostComments();
  }, [postId]);

  const handleLike = (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    console.log("commentId", commentId);
    // Logic to handle like
    axiosInstance
      .put(`/comment/likeComment/${commentId}`)
      .then((res) => {
        if (res.data.success === true) {
          console.log("res.data.data", res.data.data);
          setComments(
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: res.data.data.likes,
                    numberOfLikes: res.data.data.likes.length,
                  }
                : comment
            )
          );
        } else {
          setError("Failed to update like!");
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        setError(error.response.data.message);
      });
  };

  const handleCommentEdit = (comment, editedComment) => {
    setComments( comments.map((c) =>
        c._id === comment._id ? { ...c, comment: editedComment } : c
      ));
  };

  const handleDeleteComment = (commentId) => {

    axiosInstance
     .delete(`/comment/deleteComment/${commentId}`)
     .then((res) => {
        if (res.data.success === true) {
          setComments(comments.filter((comment) => comment._id!== commentId));
          setShowModal(false);
        } else {
          setError("Failed to delete comment!");
        }
      })
     .catch((error) => {
        console.error("Error Response", error);
        setError(error.response.data.message);
      });
  }

  return (
    <div className="max-w-2xl max-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            className="w-full rounded-md p-2 focus:outline-none"
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - commentInput.length} characters remaining
            </p>
            <Button className="cursor-pointer hover:text-gray-600" outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>

          {error && (
            <Alert
              className="mt-5"
              color="failure"
              onDismiss={() => dispatch(dismissImageAlert())}
            >
              {error}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5 text-gray-500 mt-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((comment) => {
            const key = comment._id || comment.createdAt;
            return key ? (
              <Comment
                key={key}
                comment={comment}
                onLike={handleLike}
                onEdit={handleCommentEdit}
                onDelete={(commentId)=>{
                    setCommentToDelete(commentId);
                    setShowModal(true);
                }}
              />
            ) : null; // skip rendering if no valid key
          })}
        </>
      )}

        <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              popup
              size="md"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete your comment ?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" 
                    onClick={handleDeleteComment(commentToDelete)}
                    >
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      No,cancel
                    </Button>
                  </div>
                  {error && (
                    <Alert
                      className="mt-2"
                      color="failure"
                      onDismiss={() => dispatch(dismissImageAlert())}
                    >
                      {error}
                    </Alert>
                  )}
                </div>
              </Modal.Body>
            </Modal>
    </div>
  );
};
