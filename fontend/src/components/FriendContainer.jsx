import React from 'react'
import { Camera, Loader, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState, useCallback } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore"
import { Navigate } from "react-router-dom";

const FriendContainer = () => {
  const {
    type, friends, getFriends,
    getRequsetFriends, requestsFriend,
    getInvitateFriends, invitatesFriend,
    removeFriend, cancleRequest, acceptInvitation,
    isFriendsLoading
  } = useFriendStore();
  const { setSelectedUser, selectedUser } = useChatStore();

  const list = type === 1 ? friends : (type === 2 ? requestsFriend : invitatesFriend);

  const memoizedGetFriends = useCallback(getFriends, []);
  const memoizedGetRequestFriends = useCallback(getRequsetFriends, []);
  const memoizedGetInvitateFriends = useCallback(getInvitateFriends, []);

  useEffect(() => { memoizedGetFriends(); }, [memoizedGetFriends]);
  useEffect(() => { memoizedGetRequestFriends(); }, [memoizedGetRequestFriends]);
  useEffect(() => { memoizedGetInvitateFriends(); }, [memoizedGetInvitateFriends]);

  const handleClick = async (id) => {
    if (type === 1) {
      await removeFriend(id);
    } else if (type === 2) {
      await cancleRequest(id);
    } else {
      await acceptInvitation(id);
    }
  };
  if (isFriendsLoading){
    return(
      <div class="flex items-center justify-center min-h-screen w-full">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="w-10 h-10 bg-blue-500 rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>)
  }
  return (
    <div className='mt-12'>
      <div className="font-bold p-2 w-full text-xl mt-4">
        {list.length} {type === 1 ? "Friends" : type === 2 ? "Requests" : "Invitations"}
      </div>
      <div className="flex w-auto h-1/2 gap-6 p-4">
        {list.map((user, index) => (
          <div
            key={user._id || index}
            className="max-w-64 mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              src={user.profilePic !== "" ? user.profilePic : "https://www.assalammasjid.org/wp-content/uploads/2022/03/AVATAR-NULL.jpg"}
              
            />
            <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>

            <div>
              <button
                onClick={() => handleClick(user?._id)}
                className="ml-5 h-10 w-4/5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                {type === 1 ? "Remove" : type === 2 ? "Cancel Request" : "Accept"}
              </button>

              {selectedUser ? <Navigate to="/" /> : null}

              <button
                className="ml-5 mt-1 w-4/5 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300"
                onClick={() => setSelectedUser(user)}
              >
                Chat
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default FriendContainer;