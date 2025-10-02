import express from "express";
const app = express();
import 'dotenv/config'; //It automatically loads your .env file and populates process.env with the variables inside
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from './routes/chat.js';

import LocalStrategy from 'passport-local';
import User from './models/user.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import userRoutes  from './routes/user.js';
import authRoute  from "./routes/AuthRoute.js";
import healthcheck from "./routes/healthcheck.route.js";




// const sessionOptions ={
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized:true,
//     cookie:{
//         // expires:new Date(Date.now() +7*24*60*60*1000),
//         maxAge:7*24*60*60*1000,
//         httpOnly: true, //protect us from cross scripting attack
//         secure:false, //set true if https
//     }
// }
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


app.use("/", authRoute);
app.use("/api", chatRoutes);
app.use("/", userRoutes);
app.use("/", healthcheck);


app.listen(8080,()=>{
    console.log("Port 8080 is listening!");
    connectDB();
})


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection to DB is successful");

    }catch(err){
        console.log("Failed to connect to DB", err)

    }
}






// app.post("/test", async(req, res)=>{
//     const options ={
//         method:"POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },

//         body: JSON.stringify({
//             model:"gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })

//     }

//     try{
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);

//     }catch(err){
//         console.log(err);

//     }
// })


