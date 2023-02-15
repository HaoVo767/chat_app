import { Dropdown } from "antd";
import React, { useContext } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";

export const MessageEmotion = ({ messageId, placement }) => {
  const { selectedRoomId, typeRoom } = useContext(AppContext);
  const friendChatRoomId = sessionStorage.getItem("friendChat");
  const handleAddEmotion = (emotion) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const addEmotion = [
      {
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        emotion: emotion,
      },
    ];
    if (typeRoom === 1) {
      const roomId = selectedRoomId || "1";
      const roomRef = db.collection("rooms").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let messagesCopy = doc.data().messages;
          doc.data().messages.map((message, index) => {
            if (message.id === messageId) {
              messagesCopy.splice(index, 1, { ...message, emotion: [...message?.emotion, ...addEmotion] });
            }
            return roomRef.update({
              messages: [...messagesCopy],
            });
          });
        }
      });
    } else {
      const roomId = friendChatRoomId || "1";
      const roomRef = db.collection("friendChat").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let messagesCopy = doc.data().messages;
          doc.data().messages.map((message, index) => {
            if (message.id === messageId) {
              messagesCopy.splice(index, 1, { ...message, emotion: [...message?.emotion, ...addEmotion] });
            }
            return roomRef.update({
              messages: [...messagesCopy],
            });
          });
        }
      });
    }
  };
  const items = [
    {
      label: (
        <div className="flex">
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F60D")}>
            &#128525;
          </div>
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F602")}>
            &#128514;
          </div>
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F62E")}>
            &#128558;
          </div>
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F62D")}>
            &#128557;
          </div>
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F621")}>
            &#128545;
          </div>
          <div className="text-3xl hover:text-4xl" onClick={() => handleAddEmotion("0x1F921")}>
            &#129313;
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement={placement}
        arrow={{
          pointAtCenter: true,
        }}
        trigger={["click"]}
      >
        <BsEmojiSmile className="text-gray-400 text-xl cursor-pointer mt-4" />
      </Dropdown>
    </div>
  );
};
