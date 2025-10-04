// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ FIXED: import Routes & Route
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from './MyContext.jsx';
import { Login, Signup, Home } from './pages';
import Sidebar from './Sidebar.jsx'; // ✅ Ensure Sidebar is imported
import ChatWindow from './ChatWindow.jsx'; // ✅ Ensure ChatWindow is imported
import Chat from './Chat.jsx'; // ✅ Adjust path if needed
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isOpen, setIsOpen] = useState({
    sidebar: false,
    profile: false,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.text())
      .then((data) => console.log(data));
  }, []);

  const providerValues = {
    authToken,
    setAuthToken,
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    isOpen,
    setIsOpen,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/chat" element={
            <div className="chat-layout">
              <Sidebar />
              <ChatWindow />
            </div>
          } />
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;