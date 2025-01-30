// require('dotenv').config({path:'./.env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const port = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port : http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB connection error in index.js", err);
    });






//THIS IS AN IFFI APPROACH WHERE WE CONNECT DB AND EXPRESS BOTH


// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from 'express'

// const app = express()
// ;(async()=>{
//     try {
//         const connectdb =
//         await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
//         app.on("error", ()=>{
//             console.log("Error", error)
//             throw err
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("Database not connected", error)
//         throw err
//     }
// })()