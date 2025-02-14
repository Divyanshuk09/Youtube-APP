import React, { useState } from "react";
import { IoMenu, IoMicSharp } from "react-icons/io5"; // Icons from io5
import { AiOutlineSearch } from "react-icons/ai"; // Search icon
import { FaPlus } from "react-icons/fa6"; // Plus icon

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [userpic, setUserpic] = useState("https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg");
  const [accountmenu, setAccountmenu] = useState(false);

  const toggleaccountmenu = () => setAccountmenu(prev => !prev);

  return (
    <nav className="bg-[#5555] text-white flex items-center justify-between px-4 py-2 w-full fixed top-0 shadow-md z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <IoMenu onClick={toggleSidebar} size={25} className="cursor-pointer" />
        <a href="/" className="text-2xl font-bold text-red-500">
          YouTube
        </a>
      </div>

      {/* Middle Section (Search Bar) */}
      <div className="flex items-center gap-4 w-[45%]">
        <div className="flex border border-gray-600 w-full rounded-full overflow-hidden">
          <input type="text" placeholder="Search" className="px-4 py-2 w-full text-gray-100 bg-transparent outline-none" />
          <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] px-4">
            <AiOutlineSearch className="text-gray-200" size={20} />
          </button>
        </div>
        <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] p-2 rounded-full">
          <IoMicSharp size={20} />
        </button>
      </div>

      {/* Right Section (User Profile & Create) */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 border px-3 py-2 rounded-full bg-[#2d2d2d] hover:bg-[#3d3d3d]">
          <FaPlus size={14} />
          <span className="text-sm">Create</span>
        </button>
        <img
          onClick={toggleaccountmenu}
          src={userpic}
          alt="User"
          className="w-9 h-9 rounded-full object-cover cursor-pointer hover:outline-1"
        />
      </div>

      {/* Account Menu */}
      {accountmenu && (
        <div className="absolute right-15 top-2 w-50 bg-[#2d2d2d] p-2 rounded-lg shadow-md">
          <ul className="space-y-2">
            <li className="flex items-center gap-6">
              <img
                src={userpic}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold">John Doe</h4>
                <p className="text-gray-400">@johndoe</p>
              </div>
            </li>
            <hr className="border-gray-600 my-2" />
            <li className="flex items-center gap-2 p-2 hover:bg-[#3d3d3d] rounded-lg cursor-pointer">
              <span>Sign out</span>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;