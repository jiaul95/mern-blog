import { BrowserRouter, Routes, Route } from "react-router";
import {Home} from "./pages/Home.jsx";
import {About} from "./pages/About.jsx";
import {SignIn} from "./pages/SignIn.jsx";
import {SignUp} from "./pages/SignUp.jsx";
import {Dashboard} from "./pages/Dashboard.jsx";
import {Projects} from "./pages/Projects.jsx";
import {Header} from "./components/Header.jsx";
import {FooterComponent} from "./components/FooterComponent.jsx";
import "./assets/css/theme.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { OnlyAdminPrivateRoute } from "./components/OnlyAdminPrivateRoute.jsx";
import { CreatePost } from "./pages/CreatePost.jsx";


export default function App() {

  // const { theme } = useSelector((state) => state.theme);

  // // useEffect(() => {
  // //   document.documentElement.classList.toggle("dark", theme === "dark");
  // // }, [theme]);

  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.body.classList.add("dark-mode");
  //   } else {
  //     document.body.classList.remove("dark-mode");
  //   }
  // }, [theme]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}
