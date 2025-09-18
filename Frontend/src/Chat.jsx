import './Chat.css';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from 'react';
//rehype highlight --> FOR CODE SYNTAX ->npm
import rehypeHighlight from 'rehype-highlight';

// react markdown --> FOR TEXT FORMATTING -> npm
import ReactMarkdown from 'react-markdown';

import "highlight.js/styles/github-dark.css"; //if done /github.css //it wil be light theam of codes

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const[latestReply, setLatestReply] = useState([]);

    //implementing typing effect
    useEffect(()=>{
        if(reply == null){
            setLatestReply(null); // prevchat load
        }
        if(!prevChats?.length)return;

        const content = reply.split(" "); //individual words

        let idx = 0;

        const interval = setInterval(()=>{
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);

        },40);

    }, [prevChats, reply])

    return (
        <>
            {newChat && <h1>Ready when you are!</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => {
                        return (
                            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                                {
                                    chat.role === "user"?
                                    <p className="userMessage">{chat.content}</p>:
                                    <ReactMarkdown rehypePlugins = {[rehypeHighlight]}  >{chat.content}</ReactMarkdown>
                                }
                            </div>
                        );
                    })
                }

                {
                    prevChats.length >0 && latestReply != null &&
                    <div className="gptDiv" keys={"typing"}>
                        <ReactMarkdown rehypePlugins = {[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                        </div>

                }

                


            </div>


        </>
    )
}
export default Chat;