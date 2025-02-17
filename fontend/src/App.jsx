import Navbar from "./components/Navbar"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import SettingPage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"

import {Routes, Route, Navigate} from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { useThemeStore } from "./store/useThemeStore"

import FriendPage from "./pages/FriendPage"

  const App = () => {
    const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();

    const {theme} = useThemeStore();

    useEffect(() =>{
      checkAuth()
    },[checkAuth]);
    
    // if (isCheckingAuth && !authUser){
    //   return(
    //   <div className="flex items-center justify-center h-screen">
    //     <Loader className="size-10 animate-spin"/>
    //   </div>)
    // }

    return (
      <div data-theme={theme}>
        <Navbar/>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/friend" element={authUser ? <FriendPage /> : <Navigate to="/home" />} />

        </Routes>
      </div>
    )
  }

  export default App