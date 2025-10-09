import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from './MyContext.jsx';
import { Login, Signup, Home } from './pages';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Chat from './Chat.jsx';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailPending from './pages/VerifyEmailPending'; // ✅ Added

import './App.css';

function App() {
  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken') || null); // ✅ Fixed key
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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/current-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.isEmailVerified) {
          console.log("Authenticated user:", data);
        } else {
          console.warn("User not verified yet");
          navigate("/verify-email-pending"); // ✅ Redirect unverified users
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        localStorage.removeItem("accessToken"); // ✅ Clear expired token
        navigate("/login"); // ✅ Redirect to login
      });
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
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} /> {/* ✅ Added */}
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