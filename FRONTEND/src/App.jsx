import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import Home from "./pages/home";
function App() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setError(false)
        const response = await axios.get(
          "http://localhost:8000/api/v1/videos/homepage"
        );
        console.log(response.data.data);
        setVideos(response.data.data);
      } 
      catch (error) {
      setError(true)
      }
    })()

  }, []);

  if (error) {
    return <h1>Something went wrong</h1>
  }

  return (
    <>
    <Home/>
      <h1>No. of videos are :{videos.length} </h1>
    </>
  );
}

export default App;
