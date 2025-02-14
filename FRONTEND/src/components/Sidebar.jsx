import React from 'react';
import { GoHome } from 'react-icons/go'; // Home icon
import { PiGreaterThanBold } from 'react-icons/pi'; // Greater than icon
import { MdHistory, MdOutlineSubscriptions, MdPlaylistPlay, MdVideoLibrary } from 'react-icons/md'; // Material Design icons
import { AiOutlineLike } from 'react-icons/ai'; // Like icon
import { IoMenu } from 'react-icons/io5';

// Reusable MenuItem component
const MenuItem = ({ icon: Icon, text }) => (
  <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4 text-lg">
    <Icon size={22} />
    <span>{text}</span>
  </li>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#1d1c1c] z-40 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex flex-col p-4 gap-2">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <button onClick={toggleSidebar} className="text-gray-100 hover:text-gray-300">
              <IoMenu size={25}/>
            </button>
            <a href="/" className="text-2xl font-bold text-red-500">
              YouTube
            </a>
          </div>

          {/* Main Menu */}
          <ul className="space-y-1">
            <MenuItem icon={GoHome} text="Home" />
            <MenuItem icon={MdOutlineSubscriptions} text="Subscriptions" />
            <hr className="border-gray-600 my-2" />

            {/* User Section */}
            <li className="p-2 hover:bg-[#555] rounded-lg flex items-center gap-4">
              You <PiGreaterThanBold />
            </li>
            <MenuItem icon={MdHistory} text="History" />
            <MenuItem icon={MdPlaylistPlay} text="Playlists" />
            <MenuItem icon={MdVideoLibrary} text="Your Videos" />
            <MenuItem icon={AiOutlineLike} text="Liked Videos" />
            <hr className="border-gray-600 my-2" />

            {/* Subscriptions */}
            <li className="p-2 font-semibold">Subscriptions</li>
          </ul>
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside (only on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;