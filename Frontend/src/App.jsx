import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Login, Signup, Home } from "./pages";  // all three imported
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]); // stores all chats of curr thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isOpen, setIsOpen] = useState({
    sidebar: false,
    profile: false,
  });


  useEffect(() => {
    fetch("http://localhost:8080/signup", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    isOpen, setIsOpen,
   
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Example: keeping your existing sidebar + chatwindow */}
          <Route path="/chat" element={
            <>
              <Sidebar />
              <ChatWindow />
            </>
          } />
        </Routes>

      </MyContext.Provider>
    </div>
  )
}

export default App;
