import './ChatWindow.css';
import Chat from './Chat';
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from 'react';
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";


function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, isOpen, setIsOpen } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        console.log("message", prompt, " threadId", currThreadId)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            setReply(res.reply);
            console.log(res);

        } catch (err) {
            console.log(err);


        }
        setLoading(false);
    }

    //Append new chat to prevchat
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => {
                return [...prevChats, {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }]

            });
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(prev => ({ ...prev, profile: !prev.profile }));
    };

    //logout
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("accessToken");
            setIsOpen(prev => ({ ...prev, profile: false })); // close dropdown
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };



    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>GPTalk <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick} >
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen.profile &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            }
            <Chat />
            <PulseLoader
                className="pulselod"
                color="#fff"
                loading={loading}

            />
            <div className="chatInput">
                <div className="inputbox">
                    <input type="text" placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}


                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-arrow-turn-up"></i>
                    </div>
                </div>

                <div className="info">
                    <p>GPTalk can make mistakes. Check important info. See Cookie Preferences.</p>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;