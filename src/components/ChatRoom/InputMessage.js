import React, { useContext, useState } from "react";
import { Form, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import firebase, { db } from "../../firebase/configure";
import { AppContext } from "../../Context/AppProvider";

export default function InputMessage() {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const [inputValue, setInputValue] = useState("");
  const selectedRoomId = sessionStorage.getItem("roomId");
  const { selectedRoom } = useContext(AppContext);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
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
          },
        ],
      });
    }
    setInputValue("");
  };
  return (
    <Form
      className="w-full"
      style={{
        display: selectedRoomId ? "" : "none",
      }}
      form={form}
    >
      <Form.Item>
        <div className="text-lg">
          <TextArea
            name="message"
            placeholder="enter message..."
            autoSize={{ maxRows: 10 }}
            bordered={false}
            style={{ fontSize: "20px" }}
            onChange={handleInputChange}
            onPressEnter={(event) => {
              event.preventDefault();
              handleOnSubmit();
            }}
            value={inputValue}
          />
        </div>
        <Button
          className="absolute right-1 bottom-[-10px] text-blue-800 font-semibold"
          icon={<SendOutlined className="relative bottom-1" />}
          type="text"
          size="large"
          onClick={handleOnSubmit}
        >
          Send
        </Button>
      </Form.Item>
    </Form>
  );
}
