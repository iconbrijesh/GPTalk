import express from "express";
import 'dotenv/config'; //It automatically loads your .env file and populates process.env with the variables inside
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cors()); 

app.listen(8080,()=>{
    console.log("Port 8080 is listening!");
    connectDB();
})


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
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


