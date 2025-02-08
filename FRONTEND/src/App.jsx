import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/loginandsignup/Login";
import Signup from "./pages/loginandsignup/Signup";

const myRoutes = createBrowserRouter([
  { path: "", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  return <RouterProvider router={myRoutes} />;
}

export default App;
