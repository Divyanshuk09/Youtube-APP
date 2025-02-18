import React from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";

function Home({ sidebar }) {
  return (
    <>
    <div className="flex mt-18 overflow-hidden">
      <Sidebar sidebar={sidebar} />
      <div className={`container ${sidebar ? "ml-70" : "large-container ml-20"} transition-all duration-100`}>
        <Feed sidebar={sidebar} />
      </div>
    </div>
    </>
  );
}

export default Home;
