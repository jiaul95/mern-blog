import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  console.log("Private Route");
  const {currentUser} = useSelector((state)=>state.user);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
  
}
