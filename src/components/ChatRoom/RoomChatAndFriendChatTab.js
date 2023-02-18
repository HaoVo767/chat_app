import React, { useContext } from "react";
import { Tabs } from "antd";
import { MdGroups, MdOutlineGroup } from "react-icons/md";
import RoomList from "./GroupChatTab";
import FriendChatTab from "./FriendChatTab";
import { AppContext } from "../../Context/AppProvider";

export default function RoomChatAndFriendChatTab() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { typeRoom, setTypeRoom } = useContext(AppContext);
  const onChange = (key) => {
    setTypeRoom(key);
  };
  const items = [
    {
      key: "1",
      label: (
        <div className="flex">
          <div className="text-lg ml-2">Group chat</div>
          <div>
            <MdGroups className="text-2xl mt-1 ml-2" />
          </div>
        </div>
      ),
      children: <RoomList className="relative bottom-10" />,
    },
    {
      key: "2",
      label: (
        <div className="flex">
          <div className="text-lg ml-10">Friend chat</div>
          <div>
            <MdOutlineGroup className="text-2xl mt-1 ml-2" />
          </div>
        </div>
      ),
      children: <FriendChatTab />,
    },
  ];
  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
      tabBarStyle={{
        background: user.mode === "LIGHT" ? "#EEE" : "#000",
        color: user.mode === "LIGHT" ? "#111" : "#EEE",
        marginBottom: "-1px",
      }}
    />
  );
}
