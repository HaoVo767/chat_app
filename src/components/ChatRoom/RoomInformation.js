import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Avatar, Tooltip, Form, Modal, Input, Select, Spin, Drawer, Radio, Row, Col } from "antd";
import { EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { db } from "../../firebase/configure";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import Members from "./Members";
import Icons from "../ulity/Icons";
import { BsPeopleFill, BsFillPinAngleFill } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";
import { Friend } from "./FriendAndRequest";

export default function RoomInformation() {
  const { selectedRoom, setSelectedRoomId } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [isModalInvite, setisModalInvite] = useState(false);
  const [value, setValue] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenModalChangeRoomName, setIsOpenModalChangeRoomName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isOpenIconsRoomName, setIsOpenIconsRoomName] = useState(false);
  const [isOpenIconsDescription, setIsOpenIconsDescription] = useState(false);
  const [radioInputValue, setRadioInputValue] = useState(1);
  const [isModalInviteMyFriend, setIsModalInviteMyFriend] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const selectedRoomId = sessionStorage.getItem("roomId");
  const [form] = Form.useForm();
  const backgroundColor = user?.mode === "LIGHT" ? "rgb(229 231 235)" : "#000";
  const textColor = user?.mode === "LIGHT" ? "#111" : "#EEE";
  const roomNameIcon = useSelector((state) => state.messages?.changeRoomNameIcon);
  const roomDescriptionIcon = useSelector((state) => state.messages?.changeDescriptionIcon);
  const dispatch = useDispatch();

  useEffect(() => {
    if (roomNameIcon) {
      setNameValue((prev) => prev + String.fromCodePoint(roomNameIcon));
      dispatch(MessagesSlice.actions.addIconsChangeRoomName(null));
    }
  }, [roomNameIcon, dispatch]);

  useEffect(() => {
    if (roomDescriptionIcon) {
      setDescriptionValue((prev) => prev + String.fromCodePoint(roomDescriptionIcon));
      dispatch(MessagesSlice.actions.addIconsChangeDescription(null));
    }
  }, [roomDescriptionIcon, dispatch]);

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
            <Avatar size="small" src={opt.photoURL} key={opt.value} className="mx-2">
              {opt.photoURL ? "" : opt?.label?.charAt(0).toUpperCase()}
            </Avatar>
            {`${opt.label}`}
          </Select.Option>
        ))}
      </Select>
    );
  };
  const fetchUserListByName = async (search, curmembers) => {
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

  const fetchUserListById = async (search, curmembers) => {
    return db
      .collection("users")
      .where("uid", "==", search)
      .orderBy("createAt")
      .limit(1)
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
    setIsOpenModalChangeRoomName(false);
    setIsOpenIconsRoomName(false);
    setIsOpenIconsDescription(false);
    setNameValue("");
    setDescriptionValue("");
  };
  const handleOkChangeRoomName = () => {
    setIsOpenModalChangeRoomName(false);
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    if (nameValue.trim() !== "") {
      roomRef.update({
        name: nameValue,
        description: descriptionValue,
      });
    }
    setIsOpenIconsRoomName(false);
    setIsOpenIconsDescription(false);
    setNameValue("");
    setDescriptionValue("");
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
    return setIsLoading(false);
  };
  const handleClosePinMessage = () => {
    const roomId = selectedRoomId || "1";
    const roomRef = db.collection("rooms").doc(roomId);
    roomRef.get().then((doc) => {
      if (doc.exists) {
        roomRef.update({
          messagePin: "",
        });
      }
    });
  };

  const RadioInputChange = (e) => {
    setRadioInputValue(e.target.value);
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
        className="flex justify-between pt-2 border-r-[1px] border-t-[1px] border-stone-300 h-[70px]"
        style={{
          background: backgroundColor,
          borderBottom: "1px solid rgb(214 211 209)",
          display: selectedRoomId ? "" : "none",
        }}
      >
        <div>
          <div className="flex">
            <p className="text-xl font-bold mx-4 mt-[2px]" style={{ fontFamily: "Helvetica", color: textColor }}>
              {selectedRoom?.name}
            </p>
            <div className="cursor-pointer text-lg relative bottom-[2px]">
              <Tooltip placement="right" title="Change room name">
                <EditOutlined onClick={handleOpenModalChangeRoomName} style={{ color: textColor }} />
              </Tooltip>
            </div>
          </div>
          <span className="text-base mx-4" style={{ fontFamily: "Helvetica", color: textColor }}>
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
            style={{ color: textColor }}
          >
            Invite
          </Button>
          <Avatar.Group size="large" maxCount={3} className="mr-8 cursor-pointer">
            {members.map((member) => (
              <Tooltip title={member.displayName} key={member.uid}>
                <Avatar src={member.photoURL} className="font-semibold text-2xl bg-slate-100" onClick={showDrawer}>
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
              <div className="flex">
                <div className="w-full">
                  <Input
                    placeholder="Enter new room name"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onFocus={() => {
                      setIsOpenIconsRoomName(false);
                      setIsOpenIconsDescription(false);
                    }}
                  />
                </div>
                <div onClick={() => setIsOpenIconsRoomName(true)} className="relative right-10 top-[-10px]">
                  <Icons bottom={"-320px"} righr={"30px"} isOpenIcons={isOpenIconsRoomName} place={"changeRoomName"} />
                </div>
              </div>
            </Form.Item>
            <Form.Item label="description" name="description" className="font-semibold">
              <div className="flex">
                <Input.TextArea
                  placeholder="Enter new description"
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
                    place={"changeDescription"}
                  />
                </div>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Invite member"
          open={isModalInvite}
          closable={false}
          style={{ backgroundColor: backgroundColor }}
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
          <Row className="">
            <Col span={20}>
              <Radio.Group className="mb-2" onChange={RadioInputChange} value={radioInputValue}>
                <Radio value={1}>Name</Radio>
                <Radio value={2}>ID</Radio>
              </Radio.Group>
            </Col>
            <Col span={4} className="sm cursor-pointer">
              <div onClick={() => setIsModalInviteMyFriend(true)}>My Friends</div>
            </Col>
          </Row>
          <Form>
            <DebounceSelect
              mode="multiple"
              name="search-user"
              label="Invite member"
              value={value}
              placeholder=""
              fetchOptions={radioInputValue === 1 ? fetchUserListByName : fetchUserListById}
              onChange={(newValue) => setValue(newValue)}
              style={{ width: "100%" }}
              curmembers={selectedRoom?.members}
            />
          </Form>
        </Modal>

        <Drawer
          title="Members"
          extra={<BsPeopleFill className="text-2xl text-gray-600 relative right-48 bottom-[2px]" />}
          placement="right"
          onClose={onCloseDrawer}
          open={isOpenDrawer}
        >
          {members.map((member) => {
            return <Members member={member} key={member.uid} />;
          })}
          {isLoading && <Spin size="large" className="flex justify-center mt-[200px]" />}
          <Button className="absolute top-3 right-5 font-semibold border-black" onClick={handleOutGroup}>
            Out Group
          </Button>
        </Drawer>
      </div>

      {selectedRoom && selectedRoom?.messagePin !== "" && (
        <div
          className="flex cursor-pointer h-16"
          style={{
            backgroundColor: user.mode === "LIGHT" ? "#EEE" : "rgb(17 17 17)",
            color: textColor,
            overflowX: "hidden",
            borderBottom: "1px solid grey",
            borderRight: "1px solid white",
            fontFamily: "Helvetica",
          }}
        >
          <div>
            <div className="flex">
              <div className="flex text-lg ml-3">
                <BsFillPinAngleFill className="mt-2 mr-2" />
                <Avatar src={JSON.parse(selectedRoom?.messagePin).photoURL} />
              </div>
              <div className="text-base font-semibold mt-1 ml-2">
                {JSON.parse(selectedRoom?.messagePin).displayName}
              </div>
            </div>
            <div className="text-base ml-20">{JSON.parse(selectedRoom?.messagePin).text}</div>
          </div>
          <div onClick={handleClosePinMessage}>
            <TiDeleteOutline className=" absolute right-2 text-2xl mt-2 mr-5 text-gray-500 cursor-pointer" />
          </div>
        </div>
      )}
      <Modal
        title="Invite member"
        open={isModalInviteMyFriend}
        closable={true}
        style={{ left: "530px" }}
        footer={[
          <Button
            onClick={() => {
              setIsModalInviteMyFriend(false);
            }}
            key="cancel"
            size="large"
          >
            Cancel
          </Button>,
        ]}
      >
        {user?.friends.length > 0 &&
          user?.friends.map((friend) => {
            return (
              <Friend
                displayName={friend?.displayName}
                photoURL={friend?.photoURL}
                yourId={friend?.id}
                key={friend?.id}
                myId={user?.id}
              />
            );
          })}
      </Modal>
    </>
  );
}
