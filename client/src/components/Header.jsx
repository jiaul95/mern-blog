import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { signoutUserSuccess } from "../features/user/userSlice";
import axiosInstance from "../../axios/axios";

export const Header = () => {
  const path = useLocation().pathname;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  // const handleSignOut = ()=>{
  //   dispatch(signoutUserSuccess());
  // }

  const handleSignOut = async () => {
    await axiosInstance
      .post(`/signout`)
      .then((res) => {
        if (res.data.success === true) {
          // const protectedRoutes = [
          //   "/dashboard",
          //   "/create-post",
          //   "/update-post/:postId",
          // ];

          // const currentPath = location.pathname;

          // // Check if the current path is protected
          // const shouldRedirect = protectedRoutes.some((route) =>
          //   currentPath.startsWith(route)
          // );
          dispatch(signoutUserSuccess());

          // console.log("shouldRedirect",shouldRedirect);
          // if (shouldRedirect) {
          //   navigate("/sign-in");
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // console.log("currentUser",currentUser);

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl
      font-semibold dark:text-white"
      >
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white"
        >
          Jiaul's
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={handleTheme}
        >
          <FaMoon />
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@ {currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                @ {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" active={path === "/"}>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} to="/about" active={path === "/about"}>
          About
        </Navbar.Link>
        <Navbar.Link as={Link} to="/projects" active={path === "/projects"}>
          Projects
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
