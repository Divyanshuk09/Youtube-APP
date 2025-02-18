import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DownloadIcon from "@mui/icons-material/Download";
import { IoHandRightOutline } from "react-icons/io5";

function Sidebar({ sidebar }) {
  return (
    <aside
      className={`sidebar rounded-r-xl h-full bg-[#151515] text-white mt-2 px-2 py-2 fixed top-14 left-0 overflow-hidden transition-all duration-300 ${sidebar ? "w-64" : "w-16"}`}>
      <div className="side-bar-items flex flex-col">
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <HomeIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>Home</span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <SubscriptionsIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>Subscriptions</span>
        </div>
        <hr className="border-gray-700 my-4" />
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <AccountCircleIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>You </span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <HistoryIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>History</span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <PlaylistPlayIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>Playlists</span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <OndemandVideoIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>Your videos</span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-[#5555] cursor-pointer">
          <ThumbUpIcon fontSize="medium" />
          <span className={`text-md ${sidebar ? "block" : "hidden"}`}>Liked videos</span>
        </div>
        <hr className="border-gray-700 my-4" />
        
      </div>
    </aside>
  );
}

export default Sidebar;
