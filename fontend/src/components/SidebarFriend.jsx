import React from 'react'

import { useFriendStore } from '../store/useFriendStore'

export const SidebarFriend = () => {
  return (
    <div className="flex h-screen bg-gray-100 mt-16 w-1/5" >
    <nav className="w-full">
      <a href="#" className= "block px-6 py-2 text-gray-600 hover:bg-gray-200">All Friend</a>
      <a href="#" className="block px-6 py-2 text-gray-600 hover:bg-gray-200">Friend Requests</a>
      <a href="#" className="block px-6 py-2 text-gray-600 hover:bg-gray-200">Selection 3</a>
    </nav>
  
</div>
  )
}
