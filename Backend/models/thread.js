import mongoose from "mongoose";

//created message SCHEMA and thread schema in one file intead of separate file because  message schema does not have much role apart from being the part of thread
const megSchema = new mongoose.Schema({
    role:{
        type:String,
        enum: ["user", "assistant"],
        required:true
    },
    content:{
        type: String,
        required:true
    },
    timestamp:{
        type:Date,
        default: Date.now
    }
})

const ThreadSchema = new mongoose.Schema({
    threadID:{
        type:String,
        required:true,
        unique: true
    },

    title:{
        type:String,
        default:"new chat"
    },
    messages: [megSchema],
    updatedAt:{
        type:Data,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
export default mongoose.model("Thread",ThreadSchema )

