import React, { useContext, useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { MessageYou, MessageMe } from "./Message";
import InputMessage from "./InputMessage";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";
import RoomInformation from "./RoomInformation";
import CarouselChatWindow from "./Carousel";

export default function ChatWindow() {
  const { rooms, selectedRoom, setSelectedRoomId } = useContext(AppContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isRoomChange, setIsRoomChange] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatWindowSpin, setChatWindowSpin] = useState(false);
  const messagesEndRef = useRef(null);
  const topMessage = useRef(null);
  const selectedRoomId = sessionStorage.getItem("roomId");

  const scrollToNewestMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedRoom) {
      setSelectedRoomId(null);
      sessionStorage.removeItem("roomId");
    }
  }, [rooms, selectedRoom, setSelectedRoomId]);
  useEffect(() => {
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    roomRef.get().then((doc) => {
      if (doc.exists) {
        setMessages(doc.data().messages);
      }
    });
  }, [selectedRoom?.messages, selectedRoomId]);

  useEffect(() => {
    if (!selectedRoom) {
      setSelectedRoomId(null);
      sessionStorage.removeItem("roomId");
    }
    if (sessionStorage.getItem("roomId")) {
      setSelectedRoomId(sessionStorage.getItem("roomId"));
    }
  }, [rooms, selectedRoom, setSelectedRoomId]);

  useEffect(() => {
    setIsRoomChange(true);
    setChatWindowSpin(true);
    setMessages([]);
    setTimeout(() => {
      setIsRoomChange(false);
      setChatWindowSpin(false);
    }, 1000);
    setTimeout(() => {
      if (true) {
        scrollToNewestMessage();
      }
    }, 1200);
  }, [selectedRoomId]);

  useEffect(() => {
    const chatWindowHeight =
      messagesEndRef.current.getBoundingClientRect().y - topMessage.current.getBoundingClientRect().y;
    if (messages?.length > 9 || chatWindowHeight > window.innerHeight - 122) {
      setScroll(true);
    } else {
      setScroll(false);
    }
    scrollToNewestMessage();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <CarouselChatWindow />
      <RoomInformation />
      <div className="flex flex-1 w-full max-h-full relative">
        <div
          className="flex flex-col w-full bg-black absolute top-0 bottom-0"
          style={{
            display: selectedRoomId ? "" : "none",
            overflowY: "scroll",
            justifyContent: scroll ? "" : "end",
          }}
        >
          {chatWindowSpin && <Spin size="large" className="absolute left-1/2 inset-y-1/2" />}
          <div ref={topMessage} className="text-white"></div>
          {!isRoomChange &&
            messages &&
            messages.map((message, index) => {
              if (message.uid === user.uid)
                return (
                  <MessageMe
                    key={index}
                    text={message.text}
                    displayName={message.displayName}
                    createAt={message.createAt?.seconds}
                    photoURL={message.photoURL}
                  />
                );
              else
                return (
                  <MessageYou
                    key={index}
                    text={message.text}
                    displayName={message.displayName}
                    createAt={message.createAt?.seconds}
                    photoURL={message.photoURL}
                  />
                );
            })}
          <div ref={messagesEndRef} className="text-white"></div>
        </div>
      </div>

      <InputMessage />
    </div>
  );
}
