import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessage } from "@/features/ChatSlice";
import moment from "moment";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const Chat = ({ roomName }) => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const websocket = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const chatMassages = useSelector((state) => state.chat.message) || [];
  const messageStatus = useSelector((state) => state.chat.messageStatus);

  useEffect(() => {
    if (messageStatus === "succeeded") {
      setMessages(chatMassages);
    } else if (messageStatus === "failed") {
      setMessages([]);
    } else if (messageStatus === "idle") {
      dispatch(fetchMessage(roomName));
    }
  }, [roomName, dispatch, messageStatus]);

  useEffect(() => {
    websocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomName}/`
    );

    websocket.current.onopen = () => {
      console.log("Connected to websocket");
    };

    websocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    websocket.current.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    websocket.current.onclose = (e) => {
      console.log("WebSocket closed:", e);
    };

    return () => {
      websocket.current.close();
    };
  }, [roomName, userInfo]);

  const sendMessage = () => {
    const [senderId, receiverId] = roomName.split("_");

    websocket.current.send(
      JSON.stringify({
        message: newMessage,
        sender_id: userInfo.id,
        receiver_id: senderId === userInfo.id ? receiverId : senderId,
      })
    );
    setNewMessage("");
  };

  return (
    <>
      {messageStatus === "loading" || messageStatus === "idle" ? (
        <p>Loading...</p>
      ) : messageStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : (
        <>
          <div className="space-y-4 min-h-[80vh]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === userInfo.id ? "justify-end" : "justify-start"
                } `}
              >
                <div className="flex flex-col justify-start">
                  <p
                    className={`flex ${
                      msg.sender === userInfo.id
                        ? "justify-end"
                        : "justify-start"
                    } bg-card p-2 rounded-l`}
                  >
                    {msg.message}
                  </p>
                  <em
                    className={`text-xs text-muted-foreground ${
                      msg.sender === userInfo.id ? "text-right" : ""
                    }`}
                  >
                    {moment(msg.timestamp).fromNow()}
                  </em>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 w-full bottom-0">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
