import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { fetchChatRoom } from "@/features/ChatSlice";
import Chat from "@/components/Chat";

function ChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);
  const chatRoom = useSelector((state) => state.chat.chatRoom) || {};
  const chatRoomStatus = useSelector((state) => state.chat.chatRoomStatus);

  useEffect(() => {
    dispatch(fetchChatRoom({ receiver_id: id }));
  }, [id]);

  return (
    <>
      {chatRoomStatus === "loading" || chatRoomStatus === "idle" ? (
        <p>Loading...</p>
      ) : chatRoomStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
          <h1 className="text-2xl font-bold text-center">Chat Page</h1>
          <Chat roomName={chatRoom.name} />
        </div>
      )}
    </>
  );
}

export default ChatPage;
