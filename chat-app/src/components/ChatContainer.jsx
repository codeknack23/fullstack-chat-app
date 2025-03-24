import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader2 } from "lucide-react";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeToMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      // <div className="flex-1 flex flex-col overflow-auto">
      //   <ChatHeader />
      //   <MessageSkeleton />
      //   <MessageInput />
      // </div>

      <div className="flex flex-1  bg-base-300 overflow-auto items-center flex-col justify-center w-full">
        <Loader2 className="animate-spin opacity-50" />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 bg-base-300 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat  ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/default.png"
                      : selectedUser.profilePic || "/default.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-footer text-base-content/50 mt-1">
              <time className="text-xs ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble break-words ${
              message.senderId === authUser._id ? "bg-primary" : "bg-chat-my"
            } p-1.5 flex flex-col`}
            
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded mb-2"
                />
              )}
              {message.text && <p className="ml-0.5">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;