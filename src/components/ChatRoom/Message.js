import { Avatar, Typography } from "antd";
import React from "react";
import { formatRelative } from "date-fns";
const formatDate = (seconds) => {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};
export function MessageYou({ text, displayName, createAt, photoURL }) {
  return (
    <div
      className="mb-5 ml-10 bg-slate-50 p-2 rounded-xl"
      style={{
        width: text.length > 80 ? "800px" : "max-content",
      }}
    >
      <div className="flex">
        <Avatar src={photoURL} className="font-semibold text-xl bg-blue-500">
          {photoURL ? "" : displayName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography className="font-semibold text-base ml-1 mt-1" style={{ fontFamily: "Helvetica" }}>
          {displayName}
        </Typography>
        <Typography className="text-xs text-zinc-500 mt-[9px] ml-2">{formatDate(createAt)}</Typography>
      </div>
      <Typography className="ml-9 text-lg" style={{ fontFamily: "Helvetica" }}>
        {text}
      </Typography>
    </div>
  );
}
export function MessageMe({ text, displayName, createAt, photoURL }) {
  return (
    <div>
      <div
        className="mb-5 ml-5 bg-slate-200 p-2 rounded-xl mr-20"
        style={{
          width: text.length > 80 ? "800px" : "max-content",
          float: "right",
        }}
      >
        <div className="flex">
          <Avatar src={photoURL} className="font-semibold text-xl bg-blue-500">
            {photoURL ? "" : displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography className="font-semibold text-base ml-1 mt-1" style={{ fontFamily: "Helvetica" }}>
            {displayName}
          </Typography>
          <Typography className="text-xs text-zinc-500 mt-[9px] ml-2">{formatDate(createAt)}</Typography>
        </div>
        <Typography className="ml-9 text-lg" style={{ fontFamily: "Helvetica" }}>
          {text}
        </Typography>
      </div>
    </div>
  );
}
