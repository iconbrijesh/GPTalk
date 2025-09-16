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
                    <img src="./src/assets/blacklogo.png" alt="GPTlogo" className="logo"onClick={toggleSidebar} />
                    {isOpen && (
                        <span className="menu-icon" onClick={toggleSidebar}>
                            <i className="fa-solid fa-grip-lines"></i>
                        </span>
                    )}
                </button>
            </div>


            
        </aside>
    );
}



export default Sidebar;
