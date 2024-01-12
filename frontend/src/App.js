import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:id" element={<Chats />} />
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
