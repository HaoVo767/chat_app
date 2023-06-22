import React, { useContext, useState } from "react";
import { Dropdown, Tooltip, Drawer } from "antd";
import { BsThreeDots, BsFillReplyAllFill, BsFillPinAngleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { db } from "../../firebase/configure";
import { useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AppContext } from "../../Context/AppProvider";

export function MessageOptionMe({ messageId }) {
  const { typeRoom } = useContext(AppContext);
  const messages = useSelector((state) => state.messages?.messages);
  const selectedRoomId = sessionStorage.getItem("roomId");
  const friendChatRoomId = sessionStorage.getItem("friendChat");
  const dispatch = useDispatch();
  const handleDeleteMessage = () => {
    if (typeRoom === "1") {
      const roomId = selectedRoomId || "1";
      const roomRef = db.collection("rooms").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let messagesCopy = doc.data().messages;
          messagesCopy.map((message, index) => {
            if (message.id === messageId) {
              messagesCopy.splice(index, 1, { ...message, delete: 1 });
              for (let i = index + 1; i < messagesCopy.length; i++) {
                if (messagesCopy[i]?.replyFrom?.id === messageId) {
                  messagesCopy[i] = { ...messagesCopy[i], replyFrom: "deleted" };
                }
              }
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
          messagesCopy.map((message, index) => {
            if (message.id === messageId) {
              messagesCopy.splice(index, 1, { ...message, delete: 1 });
              for (let i = index + 1; i < messagesCopy.length; i++) {
                if (messagesCopy[i]?.replyFrom?.id === messageId) {
                  messagesCopy[i] = { ...messagesCopy[i], replyFrom: "deleted" };
                }
              }
            }
            return roomRef.update({
              messages: [...messagesCopy],
            });
          });
        }
      });
    }
  };
  const handleReplyMessage = () => {
    messages?.map((message) => {
      if (message.id === messageId) {
        dispatch(MessagesSlice.actions.replyMessage(message));
        return message;
      }
      return message;
    });
  };
  const handlePinMessage = () => {
    if (typeRoom === "1") {
      const roomId = selectedRoomId || "1";
      const roomRef = db.collection("rooms").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let pinMessage = "";
          messages?.map((message) => {
            if (message.id === messageId) {
              pinMessage = JSON.stringify(message);
            }
            return roomRef.update({
              messagePin: pinMessage,
            });
          });
        }
      });
    } else {
      const roomId = friendChatRoomId || "1";
      const roomRef = db.collection("friendChat").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let pinMessage = "";
          messages.map((message) => {
            if (message.id === messageId) {
              pinMessage = JSON.stringify(message);
            }
            return roomRef.update({
              messagePin: pinMessage,
            });
          });
        }
      });
    }
  };
  const items = [
    {
      label: (
        <div className="text-base flex" onClick={handleDeleteMessage}>
          <RiDeleteBin5Line className="text-2xl relative bottom-[2px] right-1 text-gray-600" />
          Delete
        </div>
      ),
    },
    {
      label: (
        <div className="text-base flex" onClick={handleReplyMessage}>
          <BsFillReplyAllFill className="text-xl mr-1 text-gray-700" />
          Reply
        </div>
      ),
    },
    {
      label: (
        <div className="flex" onClick={handlePinMessage}>
          <BsFillPinAngleFill className=" text-xl text-gray-700 mr-1 mt-[2px]" />
          <div className="text-base">Pin</div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ float: "right" }} className="mt-3 mr-3">
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomRight"
        arrow={{
          pointAtCenter: true,
        }}
        trigger={["click"]}
      >
        <BsThreeDots className="text-gray-400 text-3xl cursor-pointer" />
      </Dropdown>
    </div>
  );
}

export function MessageOptionYou({ messageId }) {
  const { typeRoom } = useContext(AppContext);
  const messages = useSelector((state) => state.messages?.messages);
  const selectedRoomId = sessionStorage.getItem("roomId");
  const friendChatRoomId = sessionStorage.getItem("friendChat");
  const dispatch = useDispatch();
  const handleReplyMessage = () => {
    messages?.map((message) => {
      if (message.id === messageId) {
        dispatch(MessagesSlice.actions.replyMessage(message));
        return message;
      }
      return message;
    });
  };
  const handlePinMessage = () => {
    if (typeRoom === "1") {
      const roomId = selectedRoomId || "1";
      const roomRef = db.collection("rooms").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let pinMessage = "";
          messages.map((message) => {
            if (message.id === messageId) {
              pinMessage = JSON.stringify(message);
            }
            return roomRef.update({
              messagePin: pinMessage,
            });
          });
        }
      });
    } else {
      const roomId = friendChatRoomId || "1";
      const roomRef = db.collection("friendChat").doc(roomId);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          let pinMessage = "";
          messages.map((message) => {
            if (message.id === messageId) {
              pinMessage = JSON.stringify(message);
            }
            return roomRef.update({
              messagePin: pinMessage,
            });
          });
        }
      });
    }
  };
  const items = [
    {
      label: (
        <div className="text-base flex" onClick={handleReplyMessage}>
          <BsFillReplyAllFill className="text-xl mr-1 text-gray-700" />
          Reply
        </div>
      ),
    },
    {
      label: (
        <div className="text-base flex" onClick={handlePinMessage}>
          <BsFillPinAngleFill className=" text-xl text-gray-700 mr-1 mt-[2px]" />
          Pin
        </div>
      ),
    },
  ];
  return (
    <div className="ml-3 mt-3">
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        arrow={{
          pointAtCenter: true,
        }}
        trigger={["click"]}
      >
        <BsThreeDots className="text-gray-400 text-3xl cursor-pointer" />
      </Dropdown>
    </div>
  );
}

export function Emotion({ emotions }) {
  const [open, setOpen] = useState(false);
  const hanldeOpenDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div>
        {emotions?.length > 0 && (
          <div
            style={{
              width: "180px",
              height: "28px",
              overflowX: "hidden",
              overflowY: "hidden",
              marginBottom: "-28px",
            }}
          >
            {emotions.map((emotion, index) => (
              <Tooltip title={emotion.displayName} key={index}>
                <span className="text-xl cursor-pointer ml-[-8px] pl-1" onClick={hanldeOpenDrawer}>
                  {String.fromCodePoint(emotion.emotion)}
                </span>
              </Tooltip>
            ))}
          </div>
        )}

        <Drawer
          title="All reaction"
          extra={emotions.length + " reaction"}
          placement="left"
          width={300}
          onClose={onClose}
          open={open}
        >
          {emotions?.length > 0 &&
            emotions.map((emotion, index) => (
              <div className="flex justify-between mb-1" key={index}>
                <div className="text-base ml-3">{emotion.displayName}</div>
                <div className="text-xl mr-4">{String.fromCodePoint(emotion.emotion)}</div>
              </div>
            ))}
        </Drawer>
      </div>
    </>
  );
}
