import React, { useContext } from "react";
import UserInfo from "./UserInfo";
// import RoomList from "./RoomList";
import RoomChatAndFriendChatTab from "./RoomChatAndFriendChatTab";
import { AppContext } from "../../Context/AppProvider";

export default function SideBar() {
  const { backgroundColor } = useContext(AppContext);
  return (
    <div className="h-screen border-l-[1px] border-stone-300">
      <div className="h-[70px] border-[1px] border-stone-300">
        <UserInfo />
      </div>
      <div
        style={{
          overflowY: "scroll",
          height: window.innerHeight - 70,
          background: backgroundColor,
        }}
      >
        {/* <RoomList /> */}
        <RoomChatAndFriendChatTab />
      </div>
    </div>
  );
}
