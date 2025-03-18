import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axios.js";
import {
  userFetchSuccess,
  userFetchFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  dismissImageAlert
} from "../features/user/userSlice.js";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
export const DashUsers = () => {
  const dispatch = useDispatch();
  const { currentUser, error: errorMessage } = useSelector(
    (state) => state.user
  );
  const allUsers = useSelector((state) => state.user?.allUsers) || [];

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  // useEffect(() => {
  //     console.log("Updated Posts List:", allPosts.map((p) => p._id));
  // }, [allPosts]);

  const handleShowModal = (userId) => {
    setShowModal(true);
    setUserIdToDelete(userId);
  };

  const handleDeleteUser = async () => {
    setShowModal(false);

    dispatch(deleteUserStart());

    await axiosInstance
      .delete(`/user/deleteUser/${userIdToDelete}`)
      .then((res) => {
        if (res.data.success === true) {
          const newData = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];

          const updatedUsers = allUsers
            .filter((user) => user._id !== userIdToDelete)
            .concat(newData);

          dispatch(deleteUserSuccess(res.data.message));
          dispatch(userFetchSuccess(updatedUsers));
        } else {
          dispatch(deleteUserFailure("Failed to delete profile!"));
        }
      })
      .catch((error) => {
        dispatch(deleteUserFailure(error.response.data.message));
      });
  };

  useEffect(() => {
    const getAllUsers = () => {
      axiosInstance
        .get(`/user/getUsers`)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(userFetchSuccess(res.data.data.users || []));
            if (res.data.data.users?.length < 9) {
              setShowMore(false);
            }
          } else {
            dispatch(userFetchFailure("Failed to fetch users!"));
          }
        })
        .catch((error) => {
          console.error("Error Response", error);
          dispatch(userFetchFailure(error.response.data.message));
        });
    };

    if (currentUser?.isAdmin) {
      getAllUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = () => {
    axiosInstance
      .get(`/user/getUsers`)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(userFetchSuccess([...allUsers, ...res.data.data.users]));
          if (res.data.data.users?.length || 0 < 9) {
            setShowMore(false);
          }
        } else {
          dispatch(userFetchFailure("Failed to fetch more users!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(userFetchFailure(error.response.data.message));
      });
  };

  return (
    <div
      className="table-auto overflow-x-scroll 
        md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrillbar-thumb-slate-500
        "
    >
      {currentUser?.isAdmin && allUsers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>             
            </Table.Head>
            {allUsers.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/user/${user.slug}`}>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                   {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>                 
                  <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 
                                        hover:underline cursor-pointer"
                      onClick={() => handleShowModal(user._id)}
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
        <p>You have no posts yet</p>
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
              Are you sure you want to delete your user ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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
