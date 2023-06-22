import React, { useState } from "react";
import { Button, Image } from "antd";
import { Input } from "antd";
import { AiOutlineEdit } from "react-icons/ai";

export default function Infomation() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { TextArea } = Input;
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="ml-10 mt-6 flex">
      <Image style={{ borderRadius: "50%" }} width={50} src={user.photoURL} />
      <div className="ml-4 flex-1 mt-2">
        <div className="flex">
          <div className="text-lg" style={{ fontFamily: "Helvetica" }}>
            Giới thiệu
          </div>
          {!edit && (
            <div
              className=" flex hover:cursor-pointer ml-2 mt-0.5"
              onClick={() => {
                setEdit(true);
              }}
            >
              <div className="ml-2 ">Edit</div>
              <AiOutlineEdit className="mt-1" />
            </div>
          )}
        </div>
        <div className="flex">
          {edit && (
            <div className="flex flex-1">
              <TextArea
                className="w-1/2"
                rows={2}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                onPressEnter={() => setEdit(false)}
              />
              <Button style={{ background: "#1677FF", color: "#EEE" }} className="ml-4" onClick={() => setEdit(false)}>
                Thay đổi
              </Button>
            </div>
          )}
        </div>
        {!edit && (
          <div className="flex">
            <div className="mr-20">{value}</div>
          </div>
        )}
      </div>
    </div>
  );
}
