import Navbar from "./components/Navbar";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import FriendPage from "./pages/FriendPage";
import NewsFeedPage from "./pages/NewFeedsPage"

import Notification from "./components/Notification"; // Import component thông báo

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authUser) {
      console.log("🔄 Gọi checkAuth()");
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notify) => {
      const newNotification = {
        id: Date.now(),
        type: notify.type || "Thông báo",
        content: notify.content,
        time: new Date().toLocaleTimeString(),
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 3000);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <div data-theme={theme}>
      <div className="flex">
        {/* Navbar dọc bên trái */}
        <Navbar />

        {/* Nội dung chính */}
        <div className="flex-1 ml-[84px] h-full ">
          <Routes className="h-full">
            <Route path="/" element={authUser ? <NewsFeedPage /> : <Navigate to="/login" />} />
            <Route path="/newsfeeds" element={authUser ? <NewsFeedPage /> : <Navigate to="/login" />} />
            <Route path="/messages" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/friends" element={authUser ? <FriendPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
      {/* Hiển thị thông báo */}
      <div className="fixed bottom-5 right-5 space-y-2">
        {notifications.map((notify) => (
          <Notification
            key={notify.id}
            type={notify.type}
            content={notify.content}
            time={notify.time}
            onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notify.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
