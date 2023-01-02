import React from "react";
import { Carousel } from "antd";
import chat_group_image from "../../assets/chat_group_image.png";
import create_chat_room from "../../assets/create_chat_room.jpg";
import invite_member from "../../assets/invite_member.jpg";

export default function CarouselChatWindow() {
  const selectedRoomId = sessionStorage.getItem("roomId");
  return (
    <div
      style={{
        display: selectedRoomId ? "none" : "block",
        height: "100%",
      }}
      className=" bg-slate-300"
    >
      <Carousel autoplay={true} dots={false}>
        <div
          className=" text-xl font-semibold text-blue-400 pt-[200px] text-center"
          style={{ fontFamily: "Helvetica" }}
        >
          Pick a chat or create new
          <img className="mx-auto mt-3" src={chat_group_image} width="20%" alt="chat_group" />
        </div>
        <div
          className=" text-xl font-semibold text-blue-400 pt-[200px] text-center"
          style={{ fontFamily: "Helvetica" }}
        >
          Create a new chat
          <img className="mx-auto mt-3" src={create_chat_room} alt="create_chat_room" />
        </div>
        <div
          className=" text-xl font-semibold text-blue-400 pt-[200px] text-center"
          style={{ fontFamily: "Helvetica" }}
        >
          Invite member
          <img className="mx-auto mt-3" src={invite_member} alt="invite_member" />
        </div>
      </Carousel>
    </div>
  );
}
