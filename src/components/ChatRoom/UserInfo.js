import React, { useEffect, useMemo, useState } from "react";
import { Button, Avatar, Typography, message, Dropdown, Input } from "antd";
import firebase, { db } from "../../firebase/configure";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginSlice } from "../Login/LoginSlice";
import { generateKeywords } from "../../firebase/service";
import { useFirestore } from "../../hooks/useFirestore";
import { PoweroffOutlined } from "@ant-design/icons";

export default function UserInfo() {
  const [eventChangeName, setEventChangeName] = useState(false);
  const userDisplayName = JSON.parse(sessionStorage.getItem("user"))?.displayName;
  const [value, setValue] = useState(userDisplayName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("user"))?.uid;
  const userPhotoUrl = JSON.parse(sessionStorage.getItem("user"))?.photoURL;
  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const handleChangeUserName = () => {
    setEventChangeName(true);
  };

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userId,
    };
  }, [userId]);
  const currentUser = useFirestore("users", userCondition);
  const handleChangeInputName = (e) => {
    setValue(e.target.value);
  };

  const handleEnterNewName = () => {
    setEventChangeName(false);
    const user = sessionStorage.getItem("user");
    const userData = JSON.parse(user);
    dispatch(
      LoginSlice.actions.storeUser({
        ...userData,
        displayName: value,
      })
    );
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
  const items = [
    {
      key: "1",
      label: (
        <span style={{ fontFamily: "Helvetica" }} className="text-base" onClick={handleChangeUserName}>
          Change name
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <a
          style={{ fontFamily: "Helvetica" }}
          className="text-base "
          target="_blank"
          rel="noopener noreferrer"
          href={`${userPhotoUrl}?redirect=true?type=large&redirect=true&width=500&height=500`}
        >
          View profile picture
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-[72px] bg-gray-800">
        <div className="flex ml-8 mt-4">
          <Dropdown
            menu={{
              items,
            }}
          >
            <Avatar size="large" src={user?.photoURL} className="font-semibold text-2xl bg-blue-500 cursor-pointer">
              {user?.photoURL ? "" : user?.displayName?.charAt(0).toUpperCase()}
            </Avatar>
          </Dropdown>
          <Typography
            style={{ display: eventChangeName ? "none" : "block", width: "250px" }}
            className="font-bold text-lg ml-2 mt-1 text-slate-100 overflow-hidden"
          >
            {user?.displayName}
          </Typography>
          <Input
            style={{ display: eventChangeName ? "block" : "none", height: "40px", border: "1px solid blue" }}
            className="ml-2 text-lg font-semibold cursor-auto"
            size="small"
            width="200px"
            value={value}
            onPressEnter={handleEnterNewName}
            onChange={handleChangeInputName}
          />
        </div>
        <div className="mx-6">
          <Button
            size="large"
            className="mt-4 absolute right-4 font-bold text-slate-100 hover:bg-slate-100"
            onClick={handleLogout}
            style={{ borderRadius: "5px", width: "120px" }}
            icon={<PoweroffOutlined className="relative bottom-1" />}
          >
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
