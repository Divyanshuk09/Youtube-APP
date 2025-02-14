import React from "react";
import MainLayout from "../components/Mainlayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to YouTube Clone</h1>
        <p className="text-gray-400">This is the home page.</p>
      </div>
    </MainLayout>
  );
};

export default Home;