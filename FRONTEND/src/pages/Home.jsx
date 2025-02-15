import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { formatDate } from "../utils/formateDate";
import axios from "axios";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/videos/homepage"
        );
        setVideos(response.data.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to format duration (e.g., convert seconds to mm:ss)
  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (error) {
    return <h1 className="text-white text-center mt-10">Something went wrong</h1>;
  }

  if (loading) {
    return <h1 className="text-white text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 bg-black text-white overflow-y-auto p-6 transition-all duration-200">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
            } gap-6`}
          >
            {videos.map((video) => (
              <div key={video._id} className="flex flex-col gap-2">
                {/* Thumbnail with Duration Overlay */}
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  {/* Duration Overlay */}
                  <p className="absolute bottom-2 right-2 rounded-md px-2 bg-[#272727] text-sm">
                    {formatDuration(video.duration)}
                  </p>
                </div>

                {/* Video Details */}
                <div className="flex gap-3 mt-2">
                  {/* Channel Icon */}
                  <img
                    className="w-11 h-11 rounded-full"
                    src={video.owner.avatar}
                    alt={`${video.owner.channelName}'s avatar`}
                  />

                  {/* Video Info */}
                  <div className="flex flex-col">
                    <h2 className="text-md font-semibold line-clamp-2">
                      {video.title}
                    </h2>
                    <div className="text-[14px] text-gray-400 flex flex-col gap-1">
                      <p className="text-gray-400 mt-1">
                        {video.owner.channelName}
                      </p>
                      <p>
                        {video.views} views • {formatDate(video.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;