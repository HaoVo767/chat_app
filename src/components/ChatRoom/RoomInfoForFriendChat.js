import { Avatar, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";

export default function RoomInfoForFriendChat() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColor = user?.mode === "LIGHT" ? "rgb(229 231 235)" : "#000";
  const textColor = user.mode === "LIGHT" ? "#111" : "#EEE";
  const [friend, setFriend] = useState(null);
  const { friendChatId } = useContext(AppContext);
  useEffect(() => {
    if (friendChatId) {
      db.collection("users")
        .doc(friendChatId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log(doc.data());
            setFriend(doc.data());
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [friendChatId]);
  return (
    <div
      className="flex pt-3 border-r-[1px] border-t-[1px] border-stone-300 h-[70px]"
      style={{
        background: backgroundColor,
        borderBottom: "1px solid rgb(214 211 209)",
        display: friendChatId ? "" : "none",
      }}
    >
      <Avatar size="large" src={friend?.photoURL} className="text-2xl bg-slate-100 cursor-pointer ml-5">
        {friend?.photoURL ? "" : friend?.displayName?.charAt(0).toUpperCase()}
      </Avatar>
      <Typography style={{ color: textColor }} className="font-bold text-lg ml-2 mt-1 text-slate-100 overflow-hidden">
        {friend?.displayName}
      </Typography>
    </div>
  );
}
