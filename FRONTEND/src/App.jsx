import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
function App() {

  const [sidebar, setSidebar] = useState(false);

  return (
    <div>
      <Navbar setSidebar={setSidebar}/>
       <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/watch" element={<Watch sidebar={sidebar} />} />
      </Routes> 
    </div>
  );
}

export default App;
