import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Typography,
  message,
  Dropdown,
  Input,
  Switch,
  Badge,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Radio,
  Select,
  Spin,
  Drawer,
} from "antd";
import firebase, { db } from "../../firebase/configure";
import { useNavigate } from "react-router-dom";
import { generateKeywords } from "../../firebase/service";
import { useFirestore } from "../../hooks/useFirestore";
import { debounce } from "lodash";
import { AiOutlineEdit, AiOutlinePicture, AiOutlineHome } from "react-icons/ai";
import { MdLogout, MdPersonAddAlt } from "react-icons/md";
import { HiSun, HiMoon } from "react-icons/hi";
import { BsPeople, BsPeopleFill } from "react-icons/bs";
import Icons from "../ulity/Icons";
import { Request, Friend } from "./FriendAndRequest";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";
import { LoginSlice } from "../Login/LoginSlice";
import { AppContext } from "../../Context/AppProvider";

export default function UserInfo() {
  const [eventChangeName, setEventChangeName] = useState(false);
  const [isOpenIconsChangeDisplayName, setIsOpenIconsChangeDisplayName] = useState(false);
  const [isOpenAddFriendModal, setIsOpenAddFriendModal] = useState(false);
  const [radioInputValue, setRadioInputValue] = useState(1);
  const [valueFetchUser, setValueFetchUser] = useState([]);
  const [numberOfRequest, setNumberOfRequest] = useState(0);
  const [numberOfFriend, setNumberOfFriend] = useState(0);
  const [isOpenModalRequest, setIsOpenModalRequest] = useState(false);
  const [isOpenFriendDrawer, setIsOpenFriendDrawer] = useState(false);
  const { setModeChange } = useContext(AppContext);
  const userDisplayName = JSON.parse(sessionStorage.getItem("user"))?.displayName;
  const [value, setValue] = useState(userDisplayName);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const displayNameIcon = useSelector((state) => state.messages?.changeDisplayNameIcon);
  const dispatch = useDispatch();
  const background = user.mode === "LIGHT" ? "#EEE" : "#000";
  const textColor = user.mode === "LIGHT" ? "#111" : "#EEE";
  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);
  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: user?.uid,
    };
  }, [user?.uid]);
  const currentUser = useFirestore("users", userCondition);

  // listen to firestore changes
  db.collection("users")
    .doc(currentUser[0]?.id)
    .onSnapshot((doc) => {
      // console.log("Current data: ", doc.data());
      doc.data() && sessionStorage.setItem("user", JSON.stringify(doc.data()));
      dispatch(LoginSlice.actions.storeUser({ ...doc.data(), createAt: null, id: doc.id }));
    });
  useEffect(() => {
    if (displayNameIcon) {
      setValue((prev) => prev + String.fromCodePoint(displayNameIcon));
      dispatch(MessagesSlice.actions.addIconsChangeDisplayName(null));
    }
  }, [displayNameIcon, dispatch]);
  const handleChangeUserName = () => {
    setEventChangeName(true);
  };

  useEffect(() => {
    setNumberOfRequest(user?.requests?.length);
    setNumberOfFriend(user?.friends?.length);
  }, [user]);
  const handleChangeInputName = (e) => {
    setValue(e.target.value);
  };

  const handleEnterNewName = () => {
    setEventChangeName(false);
    setIsOpenIconsChangeDisplayName(false);
    const user = sessionStorage.getItem("user");
    const userData = JSON.parse(user);
    const userWithNewDisplayName = {
      ...userData,
      displayName: value,
    };
    sessionStorage.setItem("user", JSON.stringify(userWithNewDisplayName));
    if (currentUser.length > 0) {
      const userRef = db.collection("users").doc(currentUser[0].id);
      userRef.update({
        displayName: value,
        keywords: generateKeywords(value),
      });
    }
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("roomId");
        navigate("/login");
        message.success("Log out");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const handleChangeMode = (mode) => {
    const userRef = db.collection("users").doc(currentUser[0].id);
    if (mode) {
      setModeChange("LIGHT");
      const updateMode = {
        ...user,
        mode: "LIGHT",
      };
      sessionStorage.setItem("user", JSON.stringify(updateMode));
      userRef.update({
        mode: "LIGHT",
      });
    } else {
      setModeChange("DARK");
      const updateMode = {
        ...user,
        mode: "DARK",
      };
      sessionStorage.setItem("user", JSON.stringify(updateMode));
      userRef.update({
        mode: "DARK",
      });
    }
  };
  const handleCancelAddFriend = () => {
    setValueFetchUser([]);
    setIsOpenAddFriendModal(false);
  };

  const handleOkAddFriend = () => {
    setValueFetchUser([]);
    valueFetchUser.map((value) => {
      db.collection("users")
        .where("uid", "==", value.value)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            return db
              .collection("users")
              .doc(doc.id)
              .update({
                requests: [
                  ...doc.data().requests,
                  {
                    displayName: user?.displayName,
                    photoURL: user?.photoURL,
                    uid: user?.uid,
                    id: currentUser[0]?.id,
                  },
                ],
              });
          });
        });
      return message.success("Send request success");
    });
  };
  const DebounceSelect = ({ fetchOptions, debounceTimeout = 300, ...props }) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        setOptions([]);
        setFetching(false);
        fetchOptions(value, props.friends).then((newOptions) => {
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout, props.friends]);
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
  const fetchUserListByName = async (search, friends) => {
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
          .filter((opt) => user?.uid !== opt.value && !user?.listFriendsUid.includes(opt.value));
      });
  };

  const fetchUserListById = async (search, friends) => {
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
          .filter((opt) => !friends.includes(opt.value) && !user?.listFriendsUid.includes(opt.value));
      });
  };
  const RadioInputChange = (e) => {
    setRadioInputValue(e.target.value);
  };
  const items = [
    {
      key: "0",
      label: (
        <div className="flex hover:text-blue-400">
          <span style={{ fontFamily: "Helvetica" }} className="text-base" onClick={() => navigate("/me")}>
            Trang cá nhân
          </span>
          <AiOutlineHome className="relative left-2 text-xl" />
        </div>
      ),
    },
    {
      key: "1",
      label: (
        <div className="flex hover:text-blue-400">
          <span style={{ fontFamily: "Helvetica" }} className="text-base" onClick={handleChangeUserName}>
            Change name
          </span>
          <AiOutlineEdit className="relative left-2 text-xl" />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex hover:text-blue-400" onClick={() => setIsOpenModalRequest(true)}>
          <div style={{ fontFamily: "Helvetica" }} className="text-base mr-2">
            Requests
          </div>
          <div>
            {numberOfRequest > 0 && (
              <Badge count={numberOfRequest} overflowCount={99}>
                <BsPeople className="text-xl mr-2" />
              </Badge>
            )}
            {numberOfRequest === 0 && <BsPeople className="text-xl mr-2" />}
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex  hover:text-blue-400" onClick={() => setIsOpenAddFriendModal(true)}>
          <div className="text-base" style={{ fontFamily: "Helvetica" }}>
            Add friends
          </div>
          <div>
            <MdPersonAddAlt className="text-xl ml-2" />
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div className="flex  hover:text-blue-400" onClick={() => setIsOpenFriendDrawer(true)}>
          <div className="text-base" style={{ fontFamily: "Helvetica" }}>
            Friends
          </div>
          <div className="flex">
            <BsPeopleFill className="text-xl ml-2" />
            <div className="text-lg ml-2 relative bottom-1">({numberOfFriend})</div>
          </div>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <div className="flex hover:text-blue-400">
          <a
            style={{ fontFamily: "Helvetica" }}
            className="text-base "
            target="_blank"
            rel="noopener noreferrer"
            href={`${user.photoURL}?redirect=true?type=large&redirect=true&width=500&height=500`}
          >
            View profile picture
          </a>
          <AiOutlinePicture className="relative left-2 text-xl" />
        </div>
      ),
    },
    {
      key: "6",
      label: (
        <div className="flex text-base">
          <div className="mr-1" style={{ fontFamily: "Helvetica" }}>
            ID:
          </div>
          <div style={{ fontFamily: "Helvetica" }}>{user.uid}</div>
        </div>
      ),
    },
    {
      key: "7",
      label: (
        <div className="flex hover:text-blue-400" onClick={handleLogout}>
          <span style={{ fontFamily: "Helvetica" }} className="text-base">
            Log out
          </span>
          <MdLogout className="relative left-2 text-xl" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        className="flex h-[68px] justify-between"
        style={{
          backgroundColor: background,
        }}
      >
        <div className="flex justify-between w-full">
          <div className="flex ml-8 mt-4">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomLeft"
              arrow
              overlayStyle={{ width: "maxContent" }}
            >
              <Avatar size="large" src={user?.photoURL} className="text-2xl bg-slate-100 cursor-pointer">
                {user?.photoURL ? "" : user?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
            </Dropdown>
            <Typography
              style={{ display: eventChangeName ? "none" : "block", width: "250px", color: textColor }}
              className="font-bold text-lg ml-2 mt-1 text-slate-100 overflow-hidden"
            >
              {user?.displayName}
            </Typography>
            <div style={{ display: eventChangeName ? "block" : "none" }}>
              <div className="flex">
                <div className="w-full">
                  <Input
                    style={{ height: "40px" }}
                    className="ml-2 text-lg font-semibold cursor-auto"
                    size="small"
                    width="200px"
                    value={value}
                    onPressEnter={handleEnterNewName}
                    onChange={handleChangeInputName}
                    onFocus={() => setIsOpenIconsChangeDisplayName(false)}
                  />
                </div>
                <div className="relative right-8 bottom-[10px]" onClick={() => setIsOpenIconsChangeDisplayName(true)}>
                  <Icons
                    isOpenIcons={isOpenIconsChangeDisplayName}
                    place={"changeDisplayName"}
                    bottom={"-330px"}
                    right={"-50px"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-[22px] relative right-12">
            <Switch
              checkedChildren={<HiSun className="text-xl text-yellow-400 relative bottom-[3px]" />}
              unCheckedChildren={<HiMoon className="text-base relative left-2 top-[1px]" />}
              defaultChecked={user?.mode === "LIGHT" ? true : false}
              onChange={handleChangeMode}
            />
          </div>
        </div>
        <Modal
          title="Add friend"
          open={isOpenAddFriendModal}
          closable={false}
          footer={[
            <Button onClick={handleCancelAddFriend} key="cancel" size="large">
              Cancel
            </Button>,
            <Button
              key="submit"
              className="bg-blue-600"
              size="large"
              style={{ color: "#fff" }}
              onClick={handleOkAddFriend}
            >
              Send request
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
          </Row>
          <Form>
            <DebounceSelect
              mode="multiple"
              name="search-user"
              value={valueFetchUser}
              placeholder=""
              fetchOptions={radioInputValue === 1 ? fetchUserListByName : fetchUserListById}
              onChange={(newValue) => setValueFetchUser(newValue)}
              style={{ width: "100%" }}
              friends={user?.friends}
            />
          </Form>
        </Modal>
        {/* Requests */}
        <Drawer
          title="Request"
          placement="left"
          width={600}
          open={isOpenModalRequest}
          onClose={() => setIsOpenModalRequest(false)}
          extra={<div className="text-lg">({numberOfRequest})</div>}
        >
          {user?.requests.length > 0 &&
            user?.requests.map((request) => {
              return (
                <Request
                  displayName={request?.displayName}
                  photoURL={request?.photoURL}
                  userSentRequetsId={request?.id}
                  uid={request?.uid}
                  key={request?.id}
                  userReceiveId={currentUser[0]?.id}
                />
              );
            })}
        </Drawer>
        {/* Friend */}
        <Drawer
          title="Friends"
          placement="left"
          width={500}
          open={isOpenFriendDrawer}
          onClose={() => setIsOpenFriendDrawer(false)}
          extra={<div className="text-lg">({numberOfFriend})</div>}
        >
          {currentUser[0]?.friends.length > 0 &&
            currentUser[0]?.friends.map((friend) => {
              return (
                <Friend
                  displayName={friend?.displayName}
                  photoURL={friend?.photoURL}
                  yourId={friend?.id}
                  key={friend?.id}
                  myId={currentUser[0]?.id}
                />
              );
            })}
        </Drawer>
      </div>
    </>
  );
}
