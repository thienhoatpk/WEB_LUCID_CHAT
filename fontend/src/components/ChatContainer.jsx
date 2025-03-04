import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    subscribeToMessages();
    getMessages(selectedUser._id);
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-200">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-200 h-full ">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} animate__animated animate__fadeInUp`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-base-100 shadow-lg">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs text-gray-400 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble ${
                message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-gray-300 text-gray-800"
              } rounded-lg p-4 max-w-xs mx-2 mb-2 shadow-lg`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="w-[200px] rounded-lg mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
