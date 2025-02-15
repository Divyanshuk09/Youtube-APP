import React from "react";
import {
  Home as HomeIcon,
  Whatshot as WhatshotIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as VideoLibraryIcon,
  History as HistoryIcon,
  PlaylistPlay as PlaylistPlayIcon,
  WatchLater as WatchLaterIcon,
  ThumbUp as ThumbUpIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-200`}
    >
      <div className="px-4 h-full bg-[#1e1e1e7e] text-white items-center justify-center">
        {/* Top Section */}
        <div className="top-of-sidebar">
          <ul className="flex flex-col">
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <HomeIcon />
              <p>Home</p>
            </li>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <SubscriptionsIcon />
              <p>Subscriptions</p>
            </li>
          </ul>
        </div>
        <div className="h-[0.5px] my-2 w-full bg-[#555]"></div>
        {/* Middle Section */}
        <div className="middle-section">
          <ul>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <p>You</p>
              <NavigateNextIcon />
            </li>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <HistoryIcon />
              <p>History</p>
            </li>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <PlaylistPlayIcon />
              <p>Playlist</p>
            </li>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <VideoLibraryIcon />
              <p>Your Videos</p>
            </li>
            <li className="flex items-center gap-4 hover:bg-[#3d3d3d] p-3 rounded-md cursor-pointer">
              <ThumbUpIcon />
              <p>Liked Videos</p>
            </li>
          </ul>
        </div>

        <div className="h-[0.5px] my-2 w-full bg-[#555]"></div>

        {/* Bottom Section */}
        <div className="flex text-gray-400 items-center gap-4 p-3 rounded-md cursor-pointer">
            Subscriptions
        </div>
        <li>hi</li>
      </div>
    </div>
  );
};

export default Sidebar;
