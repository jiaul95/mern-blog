import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axios.js";
import {
  dismissImageAlert,
  commentsFetchSuccess,
  commentsFetchFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} from "../features/user/postSlice.js";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export const DashComments = () => {
  const dispatch = useDispatch();
  const { currentUser, error: errorMessage } = useSelector(
    (state) => state.user
  );
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const allComments = useSelector((state) => state.post?.allComments) || [];

  console.log("allComments", allComments);

  const handleShowModal = (commentId) => {
    setShowModal(true);
    setCommentIdToDelete(commentId);
  };

  const handleDeleteComment = async () => {
    setShowModal(false);

    dispatch(deleteCommentStart());

    await axiosInstance
      .delete(`/comment/deleteComment/${commentIdToDelete}`)
      .then((res) => {
        if (res.data.success === true) {
          const newData = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];

          const updatedComments = allComments
            .filter((post) => post._id !== commentIdToDelete)
            .concat(newData);

          dispatch(deleteCommentSuccess(res.data.message));
          dispatch(commentsFetchSuccess(updatedComments));
        } else {
          dispatch(deleteCommentFailure("Failed to delete profile!"));
        }
      })
      .catch((error) => {
        dispatch(deleteCommentFailure(error.response.data.message));
      });
  };

  useEffect(() => {
    const getAllComments = () => {
      axiosInstance
        .get(`/comment/getComments`)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(commentsFetchSuccess(res.data.data.comments || []));
            if (res.data.data.comments?.length < 9) {
              setShowMore(false);
            }
          } else {
            dispatch(commentsFetchFailure("Failed to fetch comments!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(commentsFetchFailure(error.response.data.message));
        });
    };

    if (currentUser?.isAdmin) {
      getAllComments();
    }
  }, [currentUser._id]);

  const handleShowMore = () => {
    axiosInstance
      .get(`/comment/getComments?skip=${allComments.length}`)
      .then((res) => {
        if (res.data.success === true) {
          console.log("res.data.data.comments", res.data.data.comments);
          dispatch(
            commentsFetchSuccess([...allComments, ...res.data.data.comments])
          );
          if (res.data.data.comments?.length || 0 < 9) {
            setShowMore(false);
          }
        } else {
          dispatch(commentsFetchFailure("Failed to fetch more comments!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(commentsFetchFailure(error.response.data.message));
      });
  };

  return (
    <div
      className="table-auto overflow-x-scroll 
        md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrillbar-thumb-slate-500
        "
    >
      {currentUser?.isAdmin && allComments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {allComments.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.comment}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => handleShowModal(comment._id)}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm 
                            py-7
                            "
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet</p>
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
              Are you sure you want to delete your post ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No,cancel
              </Button>
            </div>
            {errorMessage && (
              <Alert
                className="mt-2"
                color="failure"
                onDismiss={() => dispatch(dismissImageAlert())}
              >
                {errorMessage}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
