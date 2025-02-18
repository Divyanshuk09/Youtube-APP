import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate, formatDuration } from "../utils/formateDate.js";
import { Link } from "react-router-dom";

const Feed = ({ sidebar }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if videos are already in localStorage
    const storedVideos = localStorage.getItem("videos");
    if (storedVideos) {
      // If they are, load them into state and skip the API call
      setVideos(JSON.parse(storedVideos));
      setLoading(false);
    } else {
      // Otherwise, fetch the data from the API
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/videos/homepage"
          );
          setVideos(response.data.data);
          localStorage.setItem("videos", JSON.stringify(response.data.data)); // Save to localStorage
        } catch (error) {
          console.error("Error fetching videos", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []); // Empty dependency array, so it runs only on mount

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;

  return (
    <div
      className={`feed grid gap-4 w-full mt-2 ${
        sidebar ? "grid-cols-3" : "ml-4 grid-cols-4"
      }`}
    >
      {videos.map((video) => (
        <Link
          to={`/watch?v=${video._id}&ab_channel=${video.owner.channelName}`}
          key={video._id}
          className="flex flex-col gap-2 relative"
        >
          <div>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg object-cover "
            />
            <span className="absolute bottom-22 right-3 bg-[#242424c8] rounded-md px-1 text-s">{formatDuration(Math.round(video.duration))}</span>
          </div>
          <div className="flex gap-3 mt-2">
            <img
              src={video.owner.avatar}
              className="w-11 h-11 rounded-full"
              alt="Channel Avatar"
            />
            <div>
              <h2 className="text-md font-semibold line-clamp-2">
                {video.title}
              </h2>
              <p className="text-gray-400 text-sm">
                {video.owner.channelName}
                <br />
                10k Views • {formatDate(video.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
