import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import firebase, { db } from "../../firebase/configure";
import { AppContext } from "../../Context/AppProvider";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";
import Icons from "../ulity/Icons";

export default function InputMessage() {
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const icon = useSelector((state) => state.messages?.messageIcon);
  const messagesReply = useSelector((state) => state.messages?.replyMessage);
  const { selectedRoom } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const [isOpenIcons, setIsOpenIcons] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const selectedRoomId = sessionStorage.getItem("roomId");

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
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    if (!messagesReply) {
      if (inputValue.trim() !== "") {
        roomRef.update({
          messages: [
            ...selectedRoom.messages,
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
        roomRef.update({
          messages: [
            ...selectedRoom.messages,
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
    <>
      <Form
        className="w-full"
        style={{
          display: selectedRoomId ? "" : "none",
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
    </>
  );
}
