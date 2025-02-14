import React, { useState } from "react";
import { IoExitOutline, IoMenu, IoMicSharp } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [userpic] = useState("https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg");
  const [account, setAccount] = useState(false);
  const [openmenu, setOpenmenu] = useState(false);

  const accountmenu = () => setAccount(prev => !prev);
  const toggleMenu = () => setOpenmenu(prev => !prev);
  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#1d1c1c] z-50 shadow-lg transition-transform duration-300 ${openmenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Navbar */}
      <nav className="bg-[#5555] text-white flex items-center justify-between px-4 py-2 w-full fixed top-0 shadow-md">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <IoMenu onClick={toggleMenu} size={25} className="cursor-pointer" />
          <a href="/" className="text-2xl font-bold text-red-500">YouTube</a>
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
            src={userpic}
            onClick={accountmenu}
            alt="User"
            className="w-9 h-9 rounded-full object-cover cursor-pointer hover:outline-1 "
          />
        </div>
        
        {/* Account Menu */}
        {account && (
            <div className="absolute top-0 w-60 mt-2 right-15 bg-[#2f2f2f] rounded-lg shadow-lg z-10">
              <ul className="flex flex-col gap-2 p-2 cursor-default">
                <li className="flex items-center gap-4 p-2">
                  <img src={userpic} alt=""  className="rounded-full w-10 " />
                  <div className="flex flex-col gap-1.5">
                    <h1>Channel name</h1>
                    <h1>username</h1>
                  </div>
                </li>
                <hr className="w-full h-0.5 border-none bg-gray-500" />
                <li className="flex items-center text-[15px] p-2 hover:bg-[#555] gap-2.5">
                  <IoExitOutline size={22} /> Sign out
                </li>
              </ul>
            </div>
          )}
      </nav>
    </>
  );
}
