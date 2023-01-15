import React, { useContext, useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { MessageYou, MessageMe, MessageMeDeleted, MessageYouDeleted, ReplyMessage } from "./Message";
import InputMessage from "./InputMessage";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";
import RoomInformation from "./RoomInformation";
import { CarouselChatWindow } from "../ulity/Carousel";
import { useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { rooms, selectedRoom, setSelectedRoomId, setIsOpenIcons } = useContext(AppContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isRoomChange, setIsRoomChange] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatWindowSpin, setChatWindowSpin] = useState(false);
  const [isGetMessage, setIsGetMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const topMessage = useRef(null);
  const selectedRoomId = sessionStorage.getItem("roomId");
  const scrollToNewestMessage = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  const backgroundColor = user?.mode === "LIGHT" ? "rgb(226 232 240)" : "#111";
  useEffect(() => {
    if (!selectedRoom) {
      setSelectedRoomId(null);
      sessionStorage.removeItem("roomId");
    }
  }, [rooms, selectedRoom, setSelectedRoomId]);
  useEffect(() => {
    setIsGetMessage(false);
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    roomRef.get().then((doc) => {
      if (doc.exists) {
        setMessages(doc.data().messages);
        let messagesCopy = [];
        doc.data().messages.map((message) => {
          messagesCopy = [...messagesCopy, { ...message, createAt: null }];
          return dispatch(MessagesSlice.actions.storeMessages(messagesCopy));
        });
      }
    });
    return setIsGetMessage(true);
  }, [selectedRoom?.messages, selectedRoomId, dispatch]);

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
    }, 600);
    setTimeout(() => {
      if (isGetMessage) {
        scrollToNewestMessage();
      }
    }, 1000);
  }, [selectedRoomId, isGetMessage]);

  useEffect(() => {
    const chatWindowHeight =
      messagesEndRef.current.getBoundingClientRect().y - topMessage.current.getBoundingClientRect().y;
    if (messages?.length > 9 || chatWindowHeight > window.innerHeight - 122) {
      setScroll(true);
    } else {
      setScroll(false);
    }
    scrollToNewestMessage();
  }, [messages.length]);
  return (
    <div className="flex flex-col h-full">
      <CarouselChatWindow />
      <RoomInformation />

      <div className="flex flex-1 w-full max-h-full relative" onClick={() => setIsOpenIcons(false)}>
        <div
          className="flex flex-col w-full absolute top-0 bottom-0"
          style={{
            background: backgroundColor,
            display: selectedRoomId ? "" : "none",
            overflowY: "scroll",
            justifyContent: scroll ? "" : "end",
          }}
        >
          {chatWindowSpin && <Spin size="large" className="absolute left-1/2 inset-y-1/2" />}
          <div ref={topMessage}></div>
          {!isRoomChange &&
            isGetMessage &&
            messages.map((message, index) => {
              if (message.uid === user.uid && message.delete === 0) {
                return (
                  <MessageMe
                    key={index}
                    text={message.text}
                    displayName={message.displayName}
                    createAt={message.createAt?.seconds}
                    photoURL={message.photoURL}
                    messageId={message.id}
                    replyFrom={message?.replyFrom}
                    emotions={message?.emotion}
                  />
                );
              } else if (message.uid === user.uid && message.delete === 1) {
                return <MessageMeDeleted key={index} />;
              } else if (message.uid !== user.uid && message.delete === 0) {
                return (
                  <MessageYou
                    key={index}
                    text={message.text}
                    displayName={message.displayName}
                    createAt={message.createAt?.seconds}
                    photoURL={message.photoURL}
                    messageId={message.id}
                    replyFrom={message?.replyFrom}
                    emotions={message?.emotion}
                  />
                );
              } else if (message.uid !== user.uid && message.delete === 1) {
                return <MessageYouDeleted key={index} />;
              }
              return isRoomChange;
            })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <div style={{ background: user.mode === "LIGHT" ? "#EEE" : "rgb(17 17 17)" }}>
        <ReplyMessage />
      </div>
      <div style={{ background: user?.mode === "LIGHT" ? "#EEE" : "#000" }}>
        <InputMessage />
      </div>
    </div>
  );
}
