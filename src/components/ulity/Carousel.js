import React, { useContext } from "react";
import { Carousel } from "antd";
import chat_group_image from "../../assets/chat_group_image.png";
import create_chat_room from "../../assets/create_chat_room.jpg";
import invite_member from "../../assets/invite_member.jpg";
import { AppContext } from "../../Context/AppProvider";

export const CarouselChatWindow = () => {
  const { selectedRoomId } = useContext(AppContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColor = user.mode === "LIGHT" ? "#EEE" : "#000";
  const textColor = user.mode === "LIGHT" ? "#000" : "#EEE";
  // const selectedRoomId = sessionStorage.getItem("roomId");
  return (
    <div
      style={{
        display: selectedRoomId ? "none" : "block",
        height: "100%",
        background: backgroundColor,
      }}
    >
      <Carousel autoplay={true} dots={false}>
        <div className=" text-xl font-semibold pt-[200px] text-center" style={{ fontFamily: "Helvetica" }}>
          <span style={{ color: textColor }}>Pick a chat or create new</span>
          <img className="mx-auto mt-3" src={chat_group_image} width="20%" alt="chat_group" />
        </div>
        <div className=" text-xl font-semibold pt-[200px] text-center" style={{ fontFamily: "Helvetica" }}>
          <span style={{ color: textColor }}>Create a new chat</span>
          <img className="mx-auto mt-3" src={create_chat_room} alt="create_chat_room" />
        </div>
        <div className=" text-xl font-semibold pt-[200px] text-center" style={{ fontFamily: "Helvetica" }}>
          <span style={{ color: textColor }}>Invite member</span>
          <img className="mx-auto mt-3" src={invite_member} alt="invite_member" />
        </div>
      </Carousel>
    </div>
  );
};
