import React from 'react'
import { Camera, Loader, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore"
import { Navigate } from "react-router-dom";

const FriendContainer = () => {
    const { friends, getFriends, type, setType } = useFriendStore();
    const { setSelectedUser, selectedUser } = useChatStore();
    
    const list = friends;
    
    useEffect(() => {
        getFriends();
    }, [getFriends]);
  return (

    <div className="flex w-auto h-1/2 gap-6 p-6 mt-12">
         
    {list.map((user) => (
      <div 
        key={user.id} 
        className="max-w-64 mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <img 
          className="w-24 h-24 rounded-full border-4 border-white shadow-md" 
          src={user.profilePic} 
          alt="User Avatar" 
        />
        <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
        {/* <p className="text-sm text-gray-500 text-center">@{user.username}</p> */}
        <div>
          <button 
            className="ml-5 h-10 w-4/5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Remove Friend
          </button>
          {selectedUser ? <Navigate to="/" /> : <> </>}
          <button 
            key={user._id}
            className="ml-5 mt-1 w-4/5 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300"
            onClick={() => setSelectedUser(user)}
          >
            Chat
          </button>
        </div>
      </div>
    ))}
  </div>
  )
}

export default FriendContainer