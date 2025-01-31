import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// ✅ Enable CORS (Cross-Origin Resource Sharing)  
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow only the specified origin from environment variables
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// ✅ Middleware to parse JSON requests  
app.use(express.json({ limit: "16kb" })); // Limit request body size to prevent large payloads  

// ✅ Middleware to parse URL-encoded data (for form submissions)  
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Extended allows nested objects  

// ✅ Serve static files from the "public" folder  
app.use(express.static("public"));

// ✅ Parse cookies from incoming requests  
app.use(cookieParser());

// ✅ Import userRouter  
import userRouter from "./routes/user.routes.js"; 

// ✅ Register user-related routes under "/api/v1/users"  
app.use("/api/v1/users", userRouter);

// Example endpoint: "http://localhost:8000/api/v1/users/register"

export { app }; // ✅ Export app for use in the main server file  
