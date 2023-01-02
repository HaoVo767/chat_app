import React from "react";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";

export default function SideBar() {
  return (
    <div className="bg-gray-700 h-screen">
      <div className="h-[75px]">
        <UserInfo />
      </div>
      <div
        style={{
          overflowY: "scroll",
          height: window.innerHeight - 75,
        }}
      >
        <RoomList />
      </div>
    </div>
  );
}
