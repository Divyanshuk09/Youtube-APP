import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { AiOutlineExpand } from "react-icons/ai";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import { IoVolumeHighOutline, IoVolumeMute } from "react-icons/io5";
import { CgExpand, CgMinimize, CgMiniPlayer } from "react-icons/cg";

const VideoPlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const videoElementRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
      );
    };
  
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault(); // Prevents page scrolling when pressing space
          togglePlay();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "p":
          toggleMiniPlayer();
          break;
        case "m":
          toggleMute();
          break;
        case "arrowright":
          playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, "seconds");
          break;
        case "arrowleft":
          playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, "seconds");
          break;
        case "arrowup":
          setVolume((prev) => Math.min(1, prev + 0.1));
          break;
        case "arrowdown":
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        default:
          break;
      }
    };
  
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  
  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  const toggleSettings = () => setShowSettings((prev) => !prev);
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    return hh ? `${hh}:${mm.toString().padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
  };

  const toggleMiniPlayer = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (videoElementRef.current && videoElementRef.current.requestPictureInPicture) {
      videoElementRef.current.requestPictureInPicture();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setProgress(seekTo);
    playerRef.current.seekTo(seekTo, "fraction");
  };

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full h-auto"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={(player) => {
          playerRef.current = player;
          videoElementRef.current = player?.getInternalPlayer();
        }}
        url={videoUrl}
        playing={playing}
        controls={false}
        width="100%"
        height="100%"
        volume={muted ? 0 : volume}
        playbackRate={playbackRate}
        onProgress={({ played }) => setProgress(played)}
        onDuration={setDuration}
      />

      <div className={`absolute bottom-0 px-4 left-0 right-0 bg-black/60 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div className="relative w-full h-1 bg-gray-700 cursor-pointer">
          <div className="absolute top-0 left-0 h-full bg-red-600" style={{ width: `${progress * 100}%` }}></div>
          <input type="range" min="0" max="1" step="0.01" value={progress} onChange={handleSeek} className="absolute top-0 left-0 w-full opacity-0 h-full" />
          <div
            className="absolute top-[-5px] left-0 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 cursor-pointer"
            style={{ left: `${progress * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white transition">
              {playing ? <IoIosPause size={20} /> : <IoIosPlay size={20} />}
            </button>
            <button onClick={toggleMute} className="text-white transition">
              {muted || volume === 0 ? <IoVolumeMute size={20} /> : <IoVolumeHighOutline size={20} />}
            </button>
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="w-16 h-1" />
            <span className="text-white text-sm">{formatTime(progress * duration)} / {formatTime(duration)}</span>
          </div>

          <div className="flex gap-5 items-center relative">
            <button onClick={toggleSettings} className="text-white transition">
              <MdSettings size={25} />
            </button>
            {showSettings && (
              <div className="absolute bottom-10 right-0 bg-gray-800 p-2 rounded-lg">
                {[0.5, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <button key={rate} onClick={() => changePlaybackRate(rate)} className="block text-white px-2 py-1 hover:bg-gray-700">{rate}x</button>
                ))}
              </div>
            )}
            {!isFullscreen && (
              <button onClick={toggleMiniPlayer} className="text-white transition">
                <CgMiniPlayer size={25} />
              </button>
            )}
            <button onClick={toggleFullscreen} className="text-white transition">
              {isFullscreen? <CgMinimize size={22}/> :<AiOutlineExpand size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;



