import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MicrophoneIcon from "@mui/icons-material/Mic";
import { FiPlus } from "react-icons/fi";
import { Avatar } from "@mui/material";


const Navbar = ({ toggleSidebar }) => {
  return (
    <div className=" text-white p-4 w-full flex items-center justify-between shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full cursor-pointer"
        >
          <MenuIcon />
        </button>
        <div className="text-xl text-red-500 font-bold">YouTube</div>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2 items-center justify-between w-160  bg-[#1e1e1e] rounded-full">
          <input
            type="text"
            className="outline-none mx-4 p-3 w-full "
            placeholder="Search"
          />
          <button className="bg-[#2e2e2e] rounded-r-full p-3 px-5 cursor-pointer">
            <SearchIcon />
          </button>
        </div>
        <div className="flex gap-2 items-center bg-[#2e2e2e] hover:bg-[#3e3e3e] p-3 rounded-full cursor-pointer">
          <MicrophoneIcon />
        </div>
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-[#3d3d3d] bg-[#2a2a2a] py-2 px-4 flex items-center gap-2 rounded-full cursor-pointer">
        <FiPlus />
        <p>Create</p>
        </button>
        <button className="hover:outline rounded-full cursor-pointer">
        <Avatar/>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
