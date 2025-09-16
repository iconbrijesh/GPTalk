import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from "./ChatWindow";
// import { MyContext } from "./MyContext.jsx";

function App() {
  // const providerValues ={};


  return (
    <div className="app">
      {/* <MyContext.Provider values={providerValues }> */}

        <Sidebar />
        <ChatWindow />
      {/* </MyContext.Provider> */}

    </div>
  )
}

export default App;
