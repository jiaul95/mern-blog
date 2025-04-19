import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { SignIn } from "./pages/SignIn.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Projects } from "./pages/Projects.jsx";
import { CreatePost } from "./pages/CreatePost.jsx";
import { UpdatePost } from "./pages/UpdatePost.jsx";
import { PostPage } from "./pages/PostPage.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { OnlyAdminPrivateRoute } from "./components/OnlyAdminPrivateRoute.jsx";
import { Search } from "./pages/Search.jsx";

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/post/:postSlug" element={<PostPage />} />
      <Route path="/search" element={<Search />} />


        <>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
        </>
      
    </Routes>
  );
};

export default AppRoutes;
