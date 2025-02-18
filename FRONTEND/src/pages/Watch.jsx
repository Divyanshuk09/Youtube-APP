import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatDate, formatDuration } from "../utils/formateDate.js";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineDownload,
  AiOutlineShareAlt,
} from "react-icons/ai";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";

const Watch = ({ sidebar }) => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/videos/homepage/`
        );
        setVideos(response.data.data);

        const matchedVideo = response.data.data.find(
          (video) => video._id === videoId
        );
        setVideo(matchedVideo || null);
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <h1 className="text-center mt-10">Loading Video...</h1>;
  if (!video) return <h1 className="text-center mt-10">Video Not Found</h1>;
  const videoUrl = video.videoFile;
  console.log("videoUrl : ",videoUrl)
  return (
    <div className="flex flex-col lg:flex-row mt-16 w-full gap-4 text-white">
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} />

      {/* Main Video Section */}
      <div className={`flex flex-col w-full ml-18 gap-4 lg:flex-row px-2 lg:px-10 ${sidebar?"ml-65":"ml-2"} transition-all duration-300`}>
        {/* Video Player Section */}
        <div className="lg:w-[70%] mt-4 w-full shadow-2xl">
          <div className="w-full bg-black rounded-md outline overflow-hidden" >
            <VideoPlayer videoUrl={video.videoFile}/>
          </div>

          {/* Video Title */}
          <h1 className="text-xl font-semibold mt-3">{video.title}</h1>

          {/* Channel & Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-3">
            {/* Channel Info */}
            <div className="flex items-center gap-4">
              <img
                src={video.owner.avatar}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-semibold">{video.owner.channelName}</h2>
                <p className="text-sm text-gray-400">1.8K subscribers</p>
              </div>
              <button className="bg-red-600 text-white px-5 py-2 rounded-full cursor-pointer hover:bg-red-700">
                Subscribe
              </button>
            </div>

            {/* Like, Dislike, Share, Download */}
            <div className="flex gap-3 mt-3 lg:mt-0">
              <div className="flex items-center rounded-full bg-gray-800">
                <button className="flex items-center gap-2 px-4 py-2 rounded-l-full hover:bg-gray-700">
                  <AiOutlineLike /> 1.2K
                </button>
                <hr className="h-full w-[0.5px] bg-gray-600" />
                <button className="flex items-center gap-2 px-4 py-2 rounded-r-full hover:bg-gray-700">
                  <AiOutlineDislike />
                </button>
              </div>
              <button className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700">
                <AiOutlineShareAlt /> Share
              </button>
              <button className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700">
                <AiOutlineDownload /> Download
              </button>
            </div>
          </div>

          {/* Video Description */}
          <div className="bg-[#212121] p-3 rounded-md mt-4">
            <h1 className="text-white font-semibold">
              200k views • 2 weeks ago • #anime #zom100
            </h1>
            <p className="text-gray-400 text-sm">{video.description}</p>
          </div>
        </div>

        {/* Recommended Videos */}
        <div className="lg:w-[30%] w-full mt-6 lg:mt-4 px-4 lg:px-0">
          {videos.map((video) => (
            <Link
              to={`/watch?v=${video._id}&ab_channel=${video.owner.channelName}`}
              key={video._id}
              className="flex gap-3 p-2 rounded-lg hover:bg-[#212121] cursor-pointer transition-all duration-200">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-[160px] h-[90px] rounded-lg object-cover"
                />
                 <span className="absolute bottom-1 right-1 bg-[#242424c8] rounded-md px-1 text-[13px]">{formatDuration(Math.round(video.duration))}</span>

              </div>

              {/* Video Info */}
              <div className="flex flex-col justify-between">
                <h2 className="text-m font-semibold text-white ">
                  {video.title}
                </h2>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400 text-[14px]">
                    {video.owner.channelName}
                  </p>
                  <p className="text-gray-400 text-[14px]">
                    10k Views • {formatDate(video.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;
