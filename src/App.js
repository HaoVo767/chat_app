import "./App.css";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppProvider from "./Context/AppProvider";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ChatRoom />} path="/chat-room" />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
