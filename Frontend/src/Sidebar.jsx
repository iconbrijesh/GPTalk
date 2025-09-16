import './Sidebar.css';
import { useState } from 'react';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header" >
                <button className="toggle-btn">
                    <img src="./src/assets/blacklogo.png" alt="GPTlogo" className="logo" onClick={toggleSidebar} />
                    {isOpen && (
                        <span className="menu-icon" onClick={toggleSidebar}>
                            <i className="fa-solid fa-grip-lines"></i>
                        </span>
                    )}
                </button>
            </div>

            <div className="newChat">
                <span><i className="fa-solid fa-pen-to-square"></i>
                { isOpen? "New chat": ""}
                </span>

                <span><i className="fa-solid fa-magnifying-glass"></i>
                { isOpen? "Search chat": ""}
                </span>
            </div>
             

            <div className="history">
                <ul>{ isOpen?  <li>hinn1</li> : ""}
                   
                </ul>
            </div>

            <div className="sign">
                <p>-By Brijesh &hearts;</p>

            </div>



        </aside>
    );
}



export default Sidebar;
