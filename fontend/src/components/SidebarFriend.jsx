import React from "react";
import { useFriendStore } from "../store/useFriendStore";

export const SidebarFriend = () => {
  const { setType, type } = useFriendStore(); 

  return (
    <div className="flex h-screen bg-gray-100 w-1/5">
      <nav className="w-full">
        <button 
        
          onClick={() => setType(1)} 
          className={`w-full block px-6 py-2 ${type === 1 ? "bg-gray-300" : "text-gray-600 hover:bg-gray-200"}`}
        >
          All Friend
        </button>

        <button 
          onClick={() => setType(2)} 
          className={`w-full block px-6 py-2 ${type === 2 ? "bg-gray-300" : "text-gray-600 hover:bg-gray-200"}`}
        >
          Friend Requests
        </button>

        <button 
          onClick={() => setType(3)} 
          className={`w-full block px-6 py-2 ${type === 3 ? "bg-gray-300" : "text-gray-600 hover:bg-gray-200"}`}
        >
          Friend Invitates
        </button>
      </nav>
    </div>
  );
};
