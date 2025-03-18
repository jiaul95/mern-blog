import {Sidebar} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutUserSuccess } from "../features/user/userSlice";
export const DashSidebar = () =>{
    
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab,setTab] = useState("");
  
  
    const  {
      currentUser
  } = useSelector((state) => state.user);

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if(tabFromUrl){
      setTab(tabFromUrl); 
    }
    // console.log("tab from url: " + tabFromUrl);
  },[location.search]);

  const handleSignOut = ()=>{
    dispatch(signoutUserSuccess());
  }

    return (
       <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab==="profile"} icon={HiUser} label={ currentUser.isAdmin ? "Admin" : "User" } labelColor="dark" as="div">
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {currentUser.isAdmin && (                        
                        <Link to='/dashboard?tab=posts'>
                            <Sidebar.Item active={tab==="posts"} icon={HiDocumentText} as="div">
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}       

                    {currentUser.isAdmin && (
                        <Link to='/dashboard?tab=users'>
                          <Sidebar.Item active={tab==="users"} icon={HiOutlineUserGroup} as="div">
                              Users
                          </Sidebar.Item>
                        </Link>
                    )}
                   
                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
       </Sidebar>       
    )
}