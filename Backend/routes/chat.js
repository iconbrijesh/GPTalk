
import express from 'express';
import Thread from '../models/thread.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

//get all threds
router.get("/thread", async (req, res) => {
    try {
        const Threads = await Thread.find({}).sort({ updatedAt: -1 });
        // decending order at updated at... most recent data at top
        res.json(Threads);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch error" });

    }

})

//get one thread by threadID
router.get("/thread/:threadId", async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({threadId:threadId});
        if (!thread) {
            res.status(404).json({ error: "Invalid thread id" });
        }
        res.json(thread.messages);



    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch chat" });
    }


});

//deleting a thread
router.delete("/thread/:threadId", async (req, res) => {
    try {
        const { threadId } = req.params;

       const deletedThread = await Thread.findOneAndDelete({ threadId: threadId });
        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Chat deleted" });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to delete thread" });

    }

})

//sending msg and getting response from openai

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required field: threadId or message" });
    }

    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            //creating new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],

            })
        } else {
            thread.messages.push({ role: "user", content: message });

        }
        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply })
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: assistantReply });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });

    }

});



router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "a4",
            title: "griffith is machivalli"
        });
        const response = await thread.save();
        res.send(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in db" });
    }


});



export default router;
