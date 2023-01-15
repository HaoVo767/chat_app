import React, { useContext, useEffect, useMemo, useState } from "react";
import { Avatar, Typography, message, Dropdown, Input, Switch } from "antd";
import firebase, { db } from "../../firebase/configure";
import { useNavigate } from "react-router-dom";
import { generateKeywords } from "../../firebase/service";
import { useFirestore } from "../../hooks/useFirestore";
import { AiOutlineEdit, AiOutlinePicture } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { HiSun, HiMoon } from "react-icons/hi";
import { AppContext } from "../../Context/AppProvider";
import Icons from "../ulity/Icons";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";

export default function UserInfo() {
  const { backgroundColor, setBackgroundColor, textColor, setTextColor } = useContext(AppContext);
  const [eventChangeName, setEventChangeName] = useState(false);
  const [isOpenIconsChangeDisplayName, setIsOpenIconsChangeDisplayName] = useState(false);
  const userDisplayName = JSON.parse(sessionStorage.getItem("user"))?.displayName;
  const [value, setValue] = useState(userDisplayName);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const initBackgroundColor = user?.mode === "LIGHT" ? "#EEE" : "#000";
  const navigate = useNavigate();
  const displayNameIcon = useSelector((state) => state.messages?.changeDisplayNameIcon);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (displayNameIcon) {
      setValue((prev) => prev + String.fromCodePoint(displayNameIcon));
      dispatch(MessagesSlice.actions.addIconsChangeDisplayName(null));
    }
  }, [displayNameIcon, dispatch]);
  const handleChangeUserName = () => {
    setEventChangeName(true);
  };

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: user?.uid,
    };
  }, [user?.uid]);
  const currentUser = useFirestore("users", userCondition);
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
      const updateMode = {
        ...user,
        mode: "LIGHT",
      };
      sessionStorage.setItem("user", JSON.stringify(updateMode));
      setBackgroundColor("#EEE");
      setTextColor("#111");
      userRef.update({
        mode: "LIGHT",
      });
    } else {
      const updateMode = {
        ...user,
        mode: "DARK",
      };
      sessionStorage.setItem("user", JSON.stringify(updateMode));
      setBackgroundColor("#000");
      setTextColor("#EEE");
      userRef.update({
        mode: "DARK",
      });
    }
  };
  const items = [
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
      key: "3",
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
          backgroundColor: backgroundColor === initBackgroundColor ? backgroundColor : initBackgroundColor,
        }}
      >
        <div className="flex ml-8 mt-4">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            placement="bottomLeft"
            arrow
            overlayStyle={{ width: "250px" }}
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
    </>
  );
}
