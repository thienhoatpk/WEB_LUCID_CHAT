import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <aside className="h-full w-80 bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">Messages</h2>
      <div className="space-y-5">
        {users.map((user) => (
          <div
            key={user._id}
            className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200 ${
              selectedUser?._id === user._id ? "bg-gray-700" : "bg-gray-800"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <div className="flex-1">
              <p className="font-medium text-lg">{user.fullName}</p>
              <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
