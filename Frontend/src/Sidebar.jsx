import './Sidebar.css';
import { useState, useEffect, useContext } from 'react';
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {

    const { allThreads, setAllThreads, currThreadId, setNewChat, setReply, setPrompt, setPrevChats, setCurrThreadId, isOpen, setIsOpen } = useContext(MyContext);


    const toggleSidebar = () => {
        setIsOpen(prev => ({ ...prev, sidebar: !prev.sidebar }));
    };


    const getAllThreads = async () => {
        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/thread`);
            const res = await response.json();


            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));
            // console.log(filteredData);
            setAllThreads(filteredData);

        } catch (err) {
            console.log("failed to fetch threads");
        }


    }

    useEffect(() => {
        getAllThreads();
    }, [])

    const createNewChat = () => {
        setNewChat(true);
        setReply(null);
        setPrompt("");
        setPrevChats([]);
        setCurrThreadId(uuidv1());

    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/thread/${newthreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log("Error fetching thread:", err);
        }
    };

    const deleteThread = async (newthreadId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/thread/${newthreadId}`
                , { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //up-dated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== newthreadId))

            if (newthreadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <aside className={`sidebar ${isOpen.sidebar ? 'open' : 'closed'}`}>
            <div className="sidebar-header" >
                <button className="toggle-btn">
                    <img src="./src/assets/GPTalk.jpg" alt="GPTlogo" className="logo" onClick={toggleSidebar} />
                    {isOpen.sidebar && (
                        <span className="menu-icon" onClick={toggleSidebar}>
                            <i className="fa-solid fa-grip-lines"></i>
                        </span>
                    )}
                </button>
            </div>

            <div className="newChat">
                <button className="chat-btn" onClick={createNewChat}>
                    <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                        {isOpen.sidebar ? "New chat" : ""}
                    </span>
                </button>

                <button className="chat-btn">
                    <span>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {isOpen.sidebar ? "Search chat" : ""}
                    </span>
                </button>
            </div>



            <div className="history">
                <ul>{isOpen.sidebar ? allThreads?.map((thread, idx) => (
                    <li key={idx}
                        onClick={(e) => changeThread(thread.threadId)}
                        assName={thread.threadId === currThreadId ? "highlighted" : " "}
                    >
                        {thread.title}
                        <span><i className="fa-solid fa-trash-can"
                            onClick={(e) => {
                                e.stopPropagation(); // stops event bubbling
                                deleteThread(thread.threadId);
                            }}


                        ></i></span>
                    </li>
                )) : ""}

                </ul>
            </div>

            <div className="sign">
                <p>-By Brijesh &hearts;</p>

            </div>



        </aside>
    );
}



export default Sidebar;
