import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";


const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    
    
    <div className="h-full bg-base-200">
      <div className="flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(100vh-0rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar/>
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;