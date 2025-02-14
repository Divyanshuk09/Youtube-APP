import React, { useState } from 'react';
import { IoHome, IoMenu } from 'react-icons/io5';
import { AiOutlineLike } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import { PiGreaterThanBold } from "react-icons/pi";
import { MdHistory, MdOutlineSubscriptions, MdPlaylistPlay, MdVideoLibrary } from "react-icons/md";

export default function Sidebar() {

  const [openmenu, setOpenmenu] = useState(false);
  const toggleMenu = () => setOpenmenu(prev => !prev);
  return (
      <div className="sidebar className={`fixed top-0 left-0 h-full bg-[#1d1c1c] z-50 shadow-lg transition-transform duration-300 ${openmenu ? 'translate-x-0' : '-translate-x-full'}`}>
        w-64 bg-[#1d1c1c] text-gray-100 h-screen overflow-y-auto">
        <div className="flex flex-col p-4 gap-2">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <IoMenu onClick={toggleMenu} size={25} />
            <a href="/"className="text-2xl font-bold text-red-500">YouTube</a>
          </div>

          {/* Main Menu */}
          <ul className="space-y-1">
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"><GoHome size={22}/> Home</li>
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"> <MdOutlineSubscriptions size={22}/>Subscriptions</li>
            <hr className="border-gray-600 my-2" />
            
            {/* User Section */}
            <li className="p-2  hover:bg-[#555] rounded-lg flex items-center gap-4"> You <PiGreaterThanBold /></li>
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"><MdHistory size={22}/> History</li>
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"><MdPlaylistPlay size={22}/> Playlists</li>
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"><MdVideoLibrary size={22}/> Your Videos</li>
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg"><AiOutlineLike size={22}/> Liked Videos</li>
            <hr className="border-gray-600 my-2" />
            
            {/* Subscriptions */}
            <li className="p-2 font-semibold">Subscriptions</li>
          </ul>
        </div>
      </div>
  );
}
