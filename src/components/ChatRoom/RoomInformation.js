import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Avatar, Tooltip, Form, Modal, Input, Select, Spin, Drawer } from "antd";
import { EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { db } from "../../firebase/configure";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import Members from "./Members";

export default function RoomInformation() {
  const { selectedRoom, isLoading, setIsLoading, setSelectedRoomId } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [isModalInvite, setisModalInvite] = useState(false);
  const [value, setValue] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenModalChangeRoomName, setIsOpenModalChangeRoomName] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const selectedRoomId = sessionStorage.getItem("roomId");
  const [form] = Form.useForm();

  const DebounceSelect = ({ fetchOptions, debounceTimeout = 300, ...props }) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        setOptions([]);
        setFetching(false);

        fetchOptions(value, props.curmembers).then((newOptions) => {
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout, props.curmembers]);
    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        size="large"
      >
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt.photoURL} key={opt.value} className="mx-2 bg-lime-700">
              {opt.photoURL ? "" : opt?.label?.charAt(0).toUpperCase()}
            </Avatar>
            {`${opt.label}`}
          </Select.Option>
        ))}
      </Select>
    );
  };
  const fetchUserList = async (search, curmembers) => {
    return db
      .collection("users")
      .where("keywords", "array-contains", search)
      .orderBy("displayName")
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
          }))

          .filter((opt) => !curmembers.includes(opt.value));
      });
  };

  const handleOpenModalChangeRoomName = () => {
    setIsOpenModalChangeRoomName(true);
  };
  const handleCancelChangeRoomName = () => {
    form.setFieldsValue({ name: "" });
    setIsOpenModalChangeRoomName(false);
  };
  const handleOkChangeRoomName = () => {
    setIsOpenModalChangeRoomName(false);
    if (form.getFieldValue()?.name?.trim() !== "" && JSON.stringify(form.getFieldValue()) !== "{}") {
      const roomId = selectedRoomId || "1";
      const roomRef = db.collection("rooms").doc(roomId);
      if (form.getFieldValue()?.description) {
        roomRef.update({
          name: form.getFieldValue()?.name,
          description: form.getFieldValue()?.description,
        });
      } else {
        roomRef.update({
          name: form.getFieldValue()?.name,
        });
      }
    }
    form.setFieldsValue({ name: "", description: "" });
  };

  const handleOpenModalInvite = () => {
    setisModalInvite(true);
  };
  const handleOkInvite = () => {
    setisModalInvite(false);
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    roomRef.update({
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });
    setValue([]);
  };
  const handleCancelInvite = () => {
    setisModalInvite(false);
    setValue([]);
  };

  const showDrawer = () => {
    setIsOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };
  const handleOutGroup = () => {
    setIsLoading(true);
    const roomId = selectedRoomId || "1";
    const docRef = db.collection("rooms").doc(roomId);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listMembers = doc.data().members;
          const roomId = selectedRoomId || "1";
          const roomRef = db.collection("rooms").doc(roomId);
          if (listMembers.length > 1) {
            const newListMembers = listMembers.filter((currentMember) => user.uid !== currentMember);
            roomRef.update({
              members: [...newListMembers],
            });
          } else {
            setSelectedRoomId(null);
            sessionStorage.removeItem("roomId");
            docRef
              .delete()
              .then(() => {
                // console.log("Document successfully deleted!");
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          }
          setIsLoading(false);
          setIsOpenDrawer(false);
          setSelectedRoomId(null);
          sessionStorage.removeItem("roomId");
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  useEffect(() => {
    const listUsers = [];
    db.collection("users")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          if (selectedRoom?.members.includes(doc.data().uid)) {
            listUsers.push(doc.data());
            setMembers(listUsers);
          }
          return doc;
        });
      });
  }, [isModalInvite, selectedRoom]);
  return (
    <>
      <div
        className="flex justify-between p-2 bg-slate-200"
        style={{
          display: selectedRoomId ? "" : "none",
        }}
      >
        <div>
          <div className="flex">
            <p className="text-xl font-bold mx-4 mt-[2px]" style={{ fontFamily: "Helvetica" }}>
              {selectedRoom?.name}
            </p>
            <div className="cursor-pointer text-lg relative bottom-[2px]">
              <Tooltip placement="right" title="Change room name">
                <EditOutlined onClick={handleOpenModalChangeRoomName} />
              </Tooltip>
            </div>
          </div>
          <span className="text-base mx-4" style={{ fontFamily: "Helvetica" }}>
            {selectedRoom?.description}
          </span>
        </div>
        <div className="relative right-3 top-2">
          <Button
            icon={<UserAddOutlined className="relative bottom-1 left-1" />}
            size="large"
            className="relative top-[-13px] right-2"
            type="text"
            onClick={handleOpenModalInvite}
          >
            Invite
          </Button>
          <Avatar.Group size="large" maxCount={3} className="mr-8 cursor-pointer">
            {members.map((member) => (
              <Tooltip title={member.displayName} key={member.uid}>
                <Avatar src={member.photoURL} className="font-semibold text-2xl bg-blue-500" onClick={showDrawer}>
                  {member.photoURL ? "" : member?.displayName?.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </div>
        <Modal
          title="Change room name"
          open={isOpenModalChangeRoomName}
          className="bg-cyan-200"
          closable={false}
          footer={[
            <Button onClick={handleCancelChangeRoomName} key="cancel" size="large">
              Cancel
            </Button>,
            <Button
              key="submit"
              className="bg-blue-600"
              size="large"
              style={{ color: "#fff" }}
              onClick={handleOkChangeRoomName}
            >
              Change
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical" size="large">
            <Form.Item label="Name" name="name" className="font-semibold">
              <Input placeholder="Enter new room name" size="" />
            </Form.Item>
            <Form.Item label="description" name="description" className="font-semibold">
              <Input placeholder="Enter new description" size="" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Invite member"
          open={isModalInvite}
          className="bg-cyan-200"
          closable={false}
          footer={[
            <Button onClick={handleCancelInvite} key="cancel" size="large">
              Cancel
            </Button>,
            <Button
              key="submit"
              className="bg-blue-600"
              size="large"
              style={{ color: "#fff" }}
              onClick={handleOkInvite}
            >
              Invite
            </Button>,
          ]}
        >
          <Form>
            <DebounceSelect
              mode="multiple"
              name="search-user"
              label="Invite member"
              value={value}
              placeholder="enter member name"
              fetchOptions={fetchUserList}
              onChange={(newValue) => setValue(newValue)}
              style={{ width: "100%" }}
              curmembers={selectedRoom?.members}
            />
          </Form>
        </Modal>

        <Drawer title="Members" placement="right" onClose={onCloseDrawer} open={isOpenDrawer}>
          {members.map((member) => {
            return <Members member={member} key={member.uid} />;
          })}
          {isLoading && <Spin size="large" className="flex justify-center mt-[200px]" />}
          <Button className="absolute top-3 right-5 font-semibold border-black" onClick={handleOutGroup}>
            Out Group
          </Button>
        </Drawer>
      </div>
    </>
  );
}
