import { SendOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppContext } from "../../Context/AppProvider";
import firebase, { db } from "../../firebase/configure";
import Icons from "../ulity/Icons";
import { MessagesSlice } from "./MessagesSlice";

export default function InputForFriendChat() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const friendChatRoomId = sessionStorage.getItem("friendChat");
  const { friendChatMessages, setSetFriendChatMessages } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isOpenIcons, setIsOpenIcons] = useState(false);
  const messagesReply = useSelector((state) => state.messages?.replyMessage);
  const icon = useSelector((state) => state.messages?.messageIcon);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (icon) {
      setInputValue((prev) => prev + String.fromCodePoint(icon));
      dispatch(MessagesSlice.actions.addIconsMessage(null));
    }
  }, [icon, dispatch]);
  const handleOnSubmit = () => {
    const roomId = friendChatRoomId || "1";
    const roomRef = db.collection("friendChat").doc(roomId);
    if (!messagesReply) {
      if (inputValue.trim() !== "") {
        setSetFriendChatMessages([
          ...friendChatMessages,
          {
            text: inputValue,
            uid: user.uid,
            photoURL: user?.providerData?.length > 0 ? user.providerData[0].photoURL : user?.photoURL,
            displayName: user.displayName,
            createAt: firebase.firestore.Timestamp.now(),
            id: Date.now(),
            delete: 0,
            emotion: [],
          },
        ]);
        roomRef.update({
          messages: [
            ...friendChatMessages,
            {
              text: inputValue,
              uid: user.uid,
              photoURL: user?.providerData?.length > 0 ? user.providerData[0].photoURL : user?.photoURL,
              displayName: user.displayName,
              createAt: firebase.firestore.Timestamp.now(),
              id: Date.now(),
              delete: 0,
              emotion: [],
            },
          ],
        });
      }
    } else {
      if (inputValue.trim() !== "") {
        setSetFriendChatMessages([
          ...friendChatMessages,
          {
            text: inputValue,
            uid: user.uid,
            photoURL: user?.providerData?.length > 0 ? user.providerData[0].photoURL : user?.photoURL,
            displayName: user.displayName,
            createAt: firebase.firestore.Timestamp.now(),
            id: Date.now(),
            delete: 0,
            emotion: [],
            replyFrom: {
              displayName: messagesReply?.displayName,
              text: messagesReply?.text,
              id: messagesReply?.id,
            },
          },
        ]);
        roomRef.update({
          messages: [
            ...friendChatMessages,
            {
              text: inputValue,
              uid: user.uid,
              photoURL: user?.providerData?.length > 0 ? user.providerData[0].photoURL : user?.photoURL,
              displayName: user.displayName,
              createAt: firebase.firestore.Timestamp.now(),
              id: Date.now(),
              delete: 0,
              emotion: [],
              replyFrom: {
                displayName: messagesReply?.displayName,
                text: messagesReply?.text,
                id: messagesReply?.id,
              },
            },
          ],
        });
        dispatch(MessagesSlice.actions.replyMessage(null));
      }
    }
    setInputValue("");
  };
  return (
    <div>
      <Form
        className="w-full"
        style={{
          display: friendChatRoomId ? "" : "none",
        }}
        form={form}
      >
        <Form.Item>
          <div className="flex">
            <div className="text-lg border-t-2 border-stone-200 flex-1 pr-40">
              <TextArea
                name="message"
                placeholder="enter message..."
                autoSize={{ maxRows: 10 }}
                bordered={false}
                style={{ fontSize: "20px", borderRadius: "0px", color: user.mode === "LIGHT" ? "#111" : "#EEE" }}
                onChange={handleInputChange}
                onPressEnter={(event) => {
                  event.preventDefault();
                  handleOnSubmit();
                }}
                value={inputValue}
                onClick={() => setIsOpenIcons(false)}
              />
            </div>
            <div className="w-[0px] flex">
              <div className="absolute right-28 bottom-4" onClick={() => setIsOpenIcons(true)}>
                <Icons bottom={"10px"} right={"0px"} isOpenIcons={isOpenIcons} place={"inputMessage"} />
              </div>
              <div>
                <Button
                  className="absolute right-1 bottom-[-8px] text-gray-500 font-semibold"
                  icon={<SendOutlined className="relative bottom-1" />}
                  type="text"
                  size="large"
                  onClick={handleOnSubmit}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
