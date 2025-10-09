import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MyContext } from './MyContext.jsx';
import { Login, Signup, Home } from './pages';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Chat from './Chat.jsx';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailPending from './pages/VerifyEmailPending';
import EmailVerified from './pages/EmailVerified';


import './App.css';

function App() {
  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken') || null);
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
  let isMounted = true;
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  // ✅ Don't run auth check on /email-verified route
  const currentPath = window.location.pathname;
  if (currentPath === "/email-verified") return;

  fetch(`${import.meta.env.VITE_API_URL}/current-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (!isMounted) return;
      if (data?.user?.isEmailVerified) {
        console.log("Authenticated user:", data);
      } else {
        console.warn("User not verified yet");
        navigate("/verify-email-pending");
      }
    })
    .catch((err) => {
      console.error("Auth check failed:", err);
      localStorage.removeItem("accessToken");
      navigate("/login");
    });

  return () => {
    isMounted = false;
  };
}, [navigate]);

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
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} /> {/* ✅ Use :token param */}
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/chat" element={
            <div className="chat-layout">
              <Sidebar />
              <ChatWindow />
            </div>
          } />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} /> {/* ✅ Optional fallback */}
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;