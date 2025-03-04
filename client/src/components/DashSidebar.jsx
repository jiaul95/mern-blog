import {Sidebar} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutUserSuccess } from "../features/user/userSlice";
export const DashSidebar = () =>{
    
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab,setTab] = useState("");

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
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab==="profile"} icon={HiUser} label={"User"} labelColor="dark" as="div">
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
       </Sidebar>       
    )
}