import React, { useContext, useEffect, useMemo, useState } from "react";
import { Typography, Row, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/service";
import { BsDot } from "react-icons/bs";
import { useFirestore } from "../../hooks/useFirestore";

export default function RoomList() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { setSelectedRoomId } = useContext(AppContext);
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
    if (form.getFieldValue()?.name?.trim() !== "" && JSON.stringify(form.getFieldValue()) !== "{}") {
      addDocument("rooms", {
        ...form.getFieldValue(),
        members: [user.uid],
        host: user.uid,
        messages: [],
      });
    }
    form.setFieldsValue({ name: "", description: "" });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    setSelectedRoomId(null);
  }, [rooms, setSelectedRoomId]);
  return (
    <>
      <div className="h-full">
        <Button
          icon={<PlusOutlined className="relative bottom-1 left-1" />}
          className="mt-5 text-white"
          size="large"
          type="text"
          style={{ fontSize: "20px", background: "transparent" }}
          onClick={handleAddRoom}
        >
          Create new chat
        </Button>
        <div>
          <Row className="ml-10 mt-5 flex-col-reverse">
            {rooms.map((room) => (
              <div className="cursor-pointer" key={room.id}>
                <Typography
                  className="text-xl text-slate-100 mt-4  hover:text-cyan-200 flex"
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    sessionStorage.setItem("roomId", room.id);
                  }}
                  style={{ fontFamily: "Helvetica", width: "max-content" }}
                >
                  {room.name}
                  <span
                    className="text-sm text-white  hover:text-cyan-200 ml-3 flex mt-[5px]"
                    style={{ fontFamily: "Helvetica" }}
                  >
                    {room.description && <BsDot className="text-xl" />}
                    {room.description}
                  </span>
                </Typography>
              </div>
            ))}
          </Row>
        </div>
      </div>
      <Modal
        title="Create Room"
        open={isModalOpen}
        className="bg-cyan-200"
        closable={false}
        footer={[
          <Button onClick={handleCancel} key="cancel" size="large">
            Cancel
          </Button>,
          <Button key="submit" className="bg-blue-600" size="large" style={{ color: "#fff" }} onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="large">
          <Form.Item label="Room name" name="name" className="font-semibold">
            <Input placeholder="Enter room name" size="" />
          </Form.Item>
          <Form.Item label="Room description" name="description" className="font-semibold">
            <Input.TextArea placeholder="Enter room description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
