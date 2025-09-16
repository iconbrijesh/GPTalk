import './ChatWindow.css';
import Chat from './Chat';

function ChatWindow() {
    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>GPTalk <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" >
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>



            </div>
            <Chat />

            <div className="chatInput">
                <div className="inputbox">
                    <input type="text" placeholder="Ask anything" />
                    <div id="submit">
                        <i class="fa-solid fa-arrow-turn-up"></i>
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