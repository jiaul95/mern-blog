
import { useEffect, useState } from "react";
import {useLocation} from "react-router-dom";
import { DashSidebar } from "../components/DashSidebar";
import { DashProfile } from "../components/DashProfile";
import { DashPosts } from "../components/DashPosts";

export const Dashboard = () => {

  const location = useLocation();
  const [tab,setTab] = useState("");

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if(tabFromUrl){
      setTab(tabFromUrl); 
    }
    console.log("tab from url: " + tabFromUrl);
  },[location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">        
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile/>}

    
      {/* posts */}
      {tab === "posts" && <DashPosts/>}

    </div>
  )
}
