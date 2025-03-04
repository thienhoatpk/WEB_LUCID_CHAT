const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"} animate__animated animate__fadeInUp`}>
          <div className="chat-image avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              <div className="skeleton w-full h-full rounded-full bg-gray-300" />
            </div>
          </div>

          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16 bg-gray-300 rounded-md" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px] bg-gray-300 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
