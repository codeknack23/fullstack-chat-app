import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const [screenSize, setScreenSize] = useState("");

  const { selectedUser } = useChatStore();

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScreenSize("lg");
      } else if (width >= 768) {
        setScreenSize("md");
      } else if (width >= 640) {
        setScreenSize("sm");
      } else {
        setScreenSize("xs");
      }
    };

    // Update screen size on resize
    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  return (
    <>
      <div className="h-screen bg-base-300">
        <div className="flex items-center  justify-center pt-2 px-2">
          <div className=" pl-2 bg-base-100 h-screen rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-3rem)]">
            <div className="flex h-full gap-2 rounded-lg overflow-hidden">
              {!selectedUser && screenSize === "md" || screenSize === "lg" ? (
                <Sidebar />
              ) : (
                !selectedUser && (
                  <Sidebar
                    fullWidth={
                      screenSize === "sm" || screenSize === "xs"|| screenSize==="md" ? true : false
                    }
                  />
                )
              )}
              {!selectedUser ? (
                (screenSize === "lg" || screenSize === "md") && (
                  <NoChatSelected />
                )
              ) : (
                <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
