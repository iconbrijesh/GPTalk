import './Chat.css';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from 'react';

// rehype highlight --> for code syntax highlighting
import rehypeHighlight from 'rehype-highlight';

// react markdown --> for text formatting
import ReactMarkdown from 'react-markdown';

import "highlight.js/styles/github-dark.css"; // dark theme for code blocks

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  // Typing effect for reply
  useEffect(() => {
    if (reply == null) {
      setLatestReply(null); // prevChat load
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split(" "); // individual words
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval); // cleanup when effect reruns
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Ready when you are!</h1>}

      <div className="chats">
        {/* render all previous chats except the last */}
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/* render the last chat (typing effect or static) */}
        {prevChats.length > 0 && (
          latestReply == null ? (
            <div className="gptDiv" key="non-typing">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length - 1].content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="gptDiv" key="typing">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Chat;
