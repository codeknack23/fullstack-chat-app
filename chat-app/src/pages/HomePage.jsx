import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <>
      <div className="h-screen bg-base-300">
        <div className="flex items-center  justify-center pt-2 px-2">
          <div className=" pl-2 bg-base-100 h-screen rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)]">
            <div className="flex h-full gap-2 rounded-lg overflow-hidden">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
