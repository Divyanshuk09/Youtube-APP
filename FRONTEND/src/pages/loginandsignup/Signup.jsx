import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function Signup() {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const data = new FormData();
    data.append("username", formData.username);
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);
    
    if (formData.avatar) data.append("avatar", formData.avatar);
    if (formData.coverImage) data.append("coverImage", formData.coverImage);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Response:", response.data);
        setLoading(false);
        navigate("/login"); 
      
    } catch (error) {
      console.error("Error:", error);
      
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border rounded" />
          <input required type="text" name="fullname" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" />
          <input required type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
          <input required type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex flex-col space-y-2 justify-between">
            <label className="text-sm font-medium">Avatar</label>
            <input required type="file" name="avatar" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="flex flex-col space-y-2 justify-between">
            <label className="text-sm font-medium">Cover Image</label>
            <input required type="file" name="coverImage" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          {/* ✅ Loader Button with 2-sec delay */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-4 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
