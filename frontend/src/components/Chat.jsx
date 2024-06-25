import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllMassage,
  fetchInitialMessage,
  resetInitialMessage,
  resetAllMessage,
} from "@/features/ChatSlice";
import moment from "moment";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Chat = ({ roomName }) => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAtTop, setIsAtTop] = useState(false);
  const [totalPages, setTotalPages] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [scroll, setScroll] = useState(false);

  const bottom = useRef(null);

  const scrollToBottom = () => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ block: "end" });
    }
  };

  const websocket = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const initialMessage =
    useSelector((state) => state.chat.initialMessage) || [];
  const initialMessageStatus = useSelector(
    (state) => state.chat.initialMessageStatus
  );
  const allMessagesData = useSelector((state) => state.chat.allMessage) || {};
  const allMessageStatus = useSelector((state) => state.chat.allMessageStatus);

  useEffect(() => {
    setMessages([]);
    dispatch(resetInitialMessage());
    dispatch(resetAllMessage());
  }, []);

  useEffect(() => {
    if (initialMessageStatus === "succeeded") {
      const chatMassages = [...initialMessage].reverse();
      setMessages([...chatMassages].concat(messages));
      setScroll(true);
    } else if (initialMessageStatus === "failed") {
      setMessages([]);
    } else if (initialMessageStatus === "idle") {
      dispatch(fetchInitialMessage(roomName));
    }
  }, [roomName, dispatch, initialMessageStatus]);

  useEffect(() => {
    if (allMessageStatus === "succeeded") {
      setTotalPages(allMessagesData.total_pages);
      setCurrentPage(allMessagesData.current_page);
      const chatMassages = [...allMessagesData.massages].reverse();
      setMessages([...chatMassages].concat(messages));
    } else if (allMessageStatus === "failed") {
      setTotalPages(2);
      setCurrentPage(1);
    }
  }, [roomName, dispatch, allMessageStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [scroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtTop) {
      console.log("Scrolled to top!");
      if (currentPage < totalPages) {
        dispatch(
          fetchAllMassage({
            roomName: roomName,
            keyword: `?page=${currentPage + 1}`,
          })
        );
      }
    }
  }, [isAtTop]);

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
      scrollToBottom();
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
      {initialMessageStatus === "loading" || initialMessageStatus === "idle" ? (
        <p>Loading...</p>
      ) : initialMessageStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : (
        <>
          {allMessageStatus === "loading" && <p>Loading...</p>}
          <div className="space-y-4 min-h-[80vh] mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === userInfo.id ? "justify-end" : "justify-start"
                } `}
              >
                <div
                  className={`flex gap-2 ${
                    msg.sender === userInfo.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <p className={`flex bg-card p-2 rounded-lg`}>{msg.message}</p>
                </div>
                <em
                  className={`text-xs text-muted-foreground ${
                    msg.sender === userInfo.id ? "text-right" : ""
                  }`}
                >
                  {moment(msg.timestamp).fromNow()}
                </em>
              </div>
            ))}
          </div>
          <div className="grid gap-4 w-full bottom-0" ref={bottom}>
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
