import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MessagesSlice } from "../ChatRoom/MessagesSlice";
import { BsEmojiSmile } from "react-icons/bs";

export default function Icons({ bottom, right, isOpenIcons, place }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const dispatch = useDispatch();
  const [icons, setIcons] = useState([]);
  useEffect(() => {
    fetch("http://localhost:9000/icons")
      .then((response) => response.json())
      .then((result) => setIcons(result.listIcons))
      .catch((err) => console.log(err));
  }, []);

  const handleAddIcon = (icon) => {
    switch (place) {
      case "inputMessage":
        return dispatch(MessagesSlice.actions.addIconsMessage(icon));
      case "createNewRoomName":
        return dispatch(MessagesSlice.actions.addIconsRoomName(icon));
      case "createNewDescription":
        return dispatch(MessagesSlice.actions.addIconsDescription(icon));
      case "changeRoomName":
        return dispatch(MessagesSlice.actions.addIconsChangeRoomName(icon));
      case "changeDescription":
        return dispatch(MessagesSlice.actions.addIconsChangeDescription(icon));
      case "changeDisplayName":
        return dispatch(MessagesSlice.actions.addIconsChangeDisplayName(icon));
      default:
        return icon;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <div>
        <div
          className="w-48 h-48"
          style={{
            display: isOpenIcons ? "block" : "none",
            position: "absolute",
            bottom: bottom,
            right: right,
            minWidth: "310px",
            height: "300px",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            zIndex: "1",
            borderRadius: "10px",
            padding: "10px",
            background: user.mode === "LIGHT" ? "#EEE" : "rgb(30 30 30)",
            overflowY: "scroll",
          }}
        >
          {icons.map((icon, index) => (
            <span className="mr-2 cursor-pointer text-xl" key={index} onClick={() => handleAddIcon(icon)}>
              {String.fromCodePoint(icon)}
            </span>
          ))}
        </div>
        <BsEmojiSmile className="text-gray-500 text-xl cursor-pointer top-5 relative left-3" />
      </div>
    </div>
  );
}
