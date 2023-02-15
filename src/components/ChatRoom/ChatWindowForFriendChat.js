import { Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../Context/AppProvider";
import { MessageMe, MessageMeDeleted, MessageYou, MessageYouDeleted } from "./Message";

export default function ChatWindowForFriendChat() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userStore = useSelector((state) => state.user.user);
  const { friendChatId, friendChatMessages, setSetFriendChatMessages } = useContext(AppContext);
  const [scroll, setScroll] = useState(false);
  const [isGetMessage, setIsGetMessage] = useState(false);
  const [isRoomChange, setIsRoomChange] = useState(false);
  const [chatWindowSpin, setChatWindowSpin] = useState(false);
  const messagesEndRef = useRef(null);
  const topMessage = useRef(null);
  const backgroundColor = user?.mode === "LIGHT" ? "rgb(226 232 240)" : "#111";
  const friendId = sessionStorage.getItem("friendChat");
  const scrollToNewestMessage = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    if (friendChatMessages) {
      setIsGetMessage(true);
    }
  }, [friendChatMessages]);

  useEffect(() => {
    if (!friendChatId) {
      sessionStorage.removeItem("friendChat");
    }
  }, [friendChatId]);

  useEffect(() => {
    setIsRoomChange(true);
    setChatWindowSpin(true);
    setSetFriendChatMessages([]);
    setTimeout(() => {
      setIsRoomChange(false);
      setChatWindowSpin(false);
    }, 600);
    setTimeout(() => {
      if (true) {
        scrollToNewestMessage();
      }
    }, 1000);
  }, [friendChatId, setSetFriendChatMessages]);

  useEffect(() => {
    const chatWindowHeight =
      messagesEndRef.current.getBoundingClientRect().y - topMessage.current.getBoundingClientRect().y;
    if (friendChatMessages?.length > 9 || chatWindowHeight > window.innerHeight - 122) {
      setScroll(true);
    } else {
      setScroll(false);
    }
    scrollToNewestMessage();
  }, [friendChatMessages.length]);
  return (
    <div className="flex flex-1 w-full max-h-full relative">
      <div
        className="flex flex-col w-full absolute top-0 bottom-0"
        style={{
          background: backgroundColor,
          display: friendChatId ? "" : "none",
          overflowY: "scroll",
          justifyContent: scroll ? "" : "end",
        }}
      >
        {chatWindowSpin && <Spin size="large" className="absolute left-1/2 inset-y-1/2" />}
        <div ref={topMessage}></div>
        {!isRoomChange &&
          isGetMessage &&
          friendChatMessages.map((message, index) => {
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
  );
}
