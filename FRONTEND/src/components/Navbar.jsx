import React from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { IoAdd, IoMic, IoSearch } from "react-icons/io5";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router";

function Navbar({setSidebar}) {
  return (
    <nav className="flex justify-between items-center bg-white px-4 py-2 shadow-md fixed w-full top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-2 ">
        <button onClick={()=>setSidebar(prev=>!prev)} className=" rounded-full hover:bg-gray-200 cursor-pointer">
          <MenuOutlinedIcon fontSize="large" />
        </button>
        <Link to={"/"}  className="text-xl font-bold text-red-600 cursor-pointer">YouTube</Link>
      </div>
      
      {/* Middle Section (Search Bar) */}
      <div className="flex items-center w-1/2 max-w-xl">
        <div className="flex border border-gray-300 rounded-full overflow-hidden w-full">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full px-4 py-2 outline-none" 
          />
          <button className="px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <IoSearch className="text-xl" />
          </button>
        </div>
        <button className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <IoMic className="text-2xl" />
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center px-3 py-2 rounded-full bg-[#2c2c2c] hover:bg-[#424242] cursor-pointer">
          <IoAdd className="text-xl mr-1" />
          <span className="hidden md:block">Create</span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
          <AccountCircleIcon fontSize="large" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
