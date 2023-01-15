import React, { useContext, useEffect, useMemo, useState } from "react";
import { Row, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/service";
import { BsDot } from "react-icons/bs";
import { RiArrowRightSFill } from "react-icons/ri";
import { useFirestore } from "../../hooks/useFirestore";
import Icons from "../ulity/Icons";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";

export default function RoomList() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isOpenIconsRoomName, setIsOpenIconsRoomName] = useState(false);
  const [isOpenIconsDescription, setIsOpenIconsDescription] = useState(false);
  const initbackground = user.mode === "LIGHT" ? "EEE" : "#000";
  const initTextColor = user.mode === "LIGHT" ? "#111" : "#EEE";
  const [background, setBackground] = useState(initbackground);
  const [textColor, setTextColor] = useState(initTextColor);
  const { setSelectedRoomId } = useContext(AppContext);
  const roomNameIcon = useSelector((state) => state.messages?.createRoomNameIcon);
  const roomDescriptionIcon = useSelector((state) => state.messages?.createDescriptionIcon);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.mode === "LIGHT") {
      setTextColor("#111");
      setBackground("#EEE");
    } else {
      setTextColor("#EEE");
      setBackground("#000");
    }
  }, [user.mode]);
  useEffect(() => {
    if (roomNameIcon) {
      setNameValue((prev) => prev + String.fromCodePoint(roomNameIcon));
      dispatch(MessagesSlice.actions.addIconsRoomName(null));
    }
  }, [roomNameIcon, dispatch]);

  useEffect(() => {
    if (roomDescriptionIcon) {
      setDescriptionValue((prev) => prev + String.fromCodePoint(roomDescriptionIcon));
      dispatch(MessagesSlice.actions.addIconsDescription(null));
    }
  }, [roomDescriptionIcon, dispatch]);

  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user?.uid,
    };
  }, [user?.uid]);
  const rooms = useFirestore("rooms", roomsCondition);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddRoom = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    if (nameValue.trim() !== "" && JSON.stringify(form.getFieldValue()) !== "{}") {
      addDocument("rooms", {
        name: nameValue,
        description: descriptionValue,
        members: [user.uid],
        host: user.uid,
        messages: [],
        messagePin: "",
      });
    }
    setIsOpenIconsRoomName(false);
    setIsOpenIconsDescription(false);
    setNameValue("");
    setDescriptionValue("");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsOpenIconsRoomName(false);
    setIsOpenIconsDescription(false);
    setNameValue("");
    setDescriptionValue("");
  };
  useEffect(() => {
    setSelectedRoomId(null);
  }, [rooms, setSelectedRoomId]);
  return (
    <>
      <div className="h-full" style={{ background: background }}>
        <div>
          <Button
            icon={<PlusOutlined className="relative bottom-1 left-1" />}
            className="mt-5"
            size="large"
            type="text"
            style={{ fontSize: "20px", background: "transparent", color: textColor }}
            onClick={handleAddRoom}
          >
            <span
              onMouseEnter={(e) => (e.target.style.color = "rgb(22 163 74)")}
              onMouseLeave={(e) => (e.target.style.color = textColor)}
              style={{ color: textColor }}
            >
              Create new chat
            </span>
          </Button>
        </div>
        <div>
          <Row className="ml-10 mt-5 flex-col-reverse">
            {rooms.map((room) => (
              <div className="cursor-pointer flex" key={room.id}>
                <div>
                  <RiArrowRightSFill className="text-2xl relative top-5 right-3 text-gray-600" />
                </div>
                <div
                  className="text-xl mt-4"
                  onMouseEnter={(e) => (e.target.style.color = "rgb(22 163 74)")}
                  onMouseLeave={(e) => (e.target.style.color = textColor)}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    sessionStorage.setItem("roomId", room.id);
                  }}
                  style={{
                    fontFamily: "Helvetica",
                    width: "max-content",
                    color: textColor,
                  }}
                >
                  {room.name}
                </div>
                <div
                  className="text-sm text-white ml-3 flex mt-[22px]"
                  style={{ fontFamily: "Helvetica", color: textColor }}
                >
                  {room.description && <BsDot className="text-xl" />}
                  {room.description}
                </div>
              </div>
            ))}
          </Row>
        </div>
      </div>
      <Modal
        title="Create Room"
        open={isModalOpen}
        style={{ background: background }}
        closable={false}
        footer={[
          <Button onClick={handleCancel} key="cancel" size="large">
            Cancel
          </Button>,
          <Button key="submit" size="large" style={{ color: "#fff", background: "blue" }} onClick={handleOk}>
            Create
          </Button>,
        ]}
        onClick={() => console.log("click")}
      >
        <Form form={form} layout="vertical" size="large">
          <Form.Item label="Room name" name="name" className="font-semibold">
            <div className="flex">
              <Input
                placeholder="Enter room name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onFocus={() => {
                  setIsOpenIconsRoomName(false);
                  setIsOpenIconsDescription(false);
                }}
              />
              <div onClick={() => setIsOpenIconsRoomName(true)} className="relative right-10 top-[-10px]">
                <Icons bottom={"-320px"} righr={"30px"} isOpenIcons={isOpenIconsRoomName} place={"createNewRoomName"} />
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Room description" name="description" className="font-semibold">
            <div className="flex">
              <Input.TextArea
                placeholder="Enter room description"
                value={descriptionValue}
                onFocus={() => {
                  setIsOpenIconsDescription(false);
                  setIsOpenIconsRoomName(false);
                }}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
              <div onClick={() => setIsOpenIconsDescription(true)} className="relative right-10 top-[-10px]">
                <Icons
                  bottom={"-320px"}
                  righr={"30px"}
                  isOpenIcons={isOpenIconsDescription}
                  place={"createNewDescription"}
                />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
