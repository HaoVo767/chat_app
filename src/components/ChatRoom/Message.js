import { Avatar, Image, Typography } from "antd";
import { formatRelative } from "date-fns";
import { MessageOptionMe, MessageOptionYou } from "./MessageOption";
import { MessageEmotion } from "../ulity/Emoji";
import { useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";
import { BsFillReplyAllFill } from "react-icons/bs";
import { Emotion } from "./MessageOption";

const formatDate = (seconds) => {
  let formattedDate = "";
  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

export function MessageYou({ text, displayName, createAt, photoURL, messageId, replyFrom, emotions, imgSrc }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColorMessageYou = user.mode === "LIGHT" ? "rgb(248 250 252)" : "rgb(64 64 64)";
  return (
    <>
      <div>
        {replyFrom && replyFrom !== "deleted" && (
          <div>
            <div
              style={{
                color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
              }}
              className="ml-20 text-base flex"
            >
              <BsFillReplyAllFill className="mr-1 mt-1" />
              {displayName} replied to {replyFrom?.displayName}
            </div>
            <div
              style={{
                color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
                border: "1px solid rgb(107 114 128)",
                width: "max-content",
                maxWidth: "800px",
                minWidth: "200px",
                padding: "10px",
                borderRadius: "10px 10px 10px 0",
                overflow: "hidden",
              }}
              className="ml-16 text-base"
            >
              <div className="text-base font-semibold" style={{ fontFamily: "Helvetica" }}>
                {replyFrom?.displayName}
              </div>
              <div className="ml-4" style={{ fontFamily: "Helvetica" }}>
                {replyFrom.text}
              </div>
            </div>
          </div>
        )}
        {replyFrom && replyFrom === "deleted" && (
          <div>
            <div
              style={{
                color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
              }}
              className="text-base ml-20"
            >
              <div className="flex relative right-5">
                <BsFillReplyAllFill className="mr-1 mt-1" />
                {displayName} replied
              </div>
              <div
                style={{
                  color: "rgb(107 114 128)",
                  border: "1px solid rgb(107 114 128)",
                  width: "max-content",
                  padding: "10px",
                  borderRadius: "10px 10px 0 10px",
                }}
                className="mr-24 text-base relative"
              >
                Message has been deleted
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <div
          className="mb-5 ml-10 p-2 rounded-xl"
          style={{
            width: text?.length > 80 ? "800px" : "max-content",
            background: backgroundColorMessageYou,
          }}
        >
          <div className="flex">
            <Avatar src={photoURL} className="font-semibold text-xl">
              {photoURL ? "" : displayName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              className="font-semibold text-base ml-1 mt-1"
              style={{ fontFamily: "Helvetica", color: user.mode === "LIGHT" ? "#111" : "#EEE" }}
            >
              {displayName}
            </Typography>
            <Typography className="text-xs mt-[7px] ml-2" style={{ color: user.mode === "LIGHT" ? "#333" : "#DDD" }}>
              {formatDate(createAt)}
            </Typography>
          </div>
          <Typography
            className="ml-9 text-lg"
            style={{ fontFamily: "Helvetica", color: user.mode === "LIGHT" ? "#111" : "#EEE" }}
          >
            {text}
          </Typography>
          <Image src={imgSrc} width={200} alt="" />
          <div className="relative bottom-2">
            <Emotion emotions={emotions} />
          </div>
        </div>
        <div className="flex ml-3">
          <MessageEmotion messageId={messageId} placement={"bottomLeft"} />
          <MessageOptionYou messageId={messageId} />
        </div>
      </div>
    </>
  );
}
export function MessageMe({ text, displayName, createAt, photoURL, messageId, replyFrom, emotions, imgSrc }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColorMessageMe = user?.mode === "LIGHT" ? "rgb(2 132 199)" : "rgb(63 98 18)";
  return (
    <>
      <div className="mb-5">
        {replyFrom && replyFrom !== "deleted" && (
          <div>
            <div
              style={{
                color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
                float: "right",
              }}
              className="text-base"
            >
              <div className="relative top-5">
                <div className="flex relative right-10" style={{ overflow: "hidden", height: "22px" }}>
                  <BsFillReplyAllFill className="mr-1 mt-1" />
                  {displayName} replied to {replyFrom?.displayName}
                </div>
                <div
                  style={{
                    color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
                    border: "1px solid rgb(107 114 128)",
                    width: "max-content",
                    maxWidth: "800px",
                    minWidth: "200px",
                    padding: "10px",
                    borderRadius: "10px 10px 0 10px",
                    overflow: "hidden",
                  }}
                  className="mr-24 text-base"
                >
                  <div className="text-base font-semibold" style={{ fontFamily: "Helvetica" }}>
                    {replyFrom?.displayName}
                  </div>
                  <div className="ml-4" style={{ fontFamily: "Helvetica" }}>
                    {replyFrom.text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {replyFrom && replyFrom === "deleted" && (
          <div>
            <div
              style={{
                color: user.mode === "LIGHT" ? "rgb(75 85 99)" : "rgb(209 213 219)",
                float: "right",
              }}
              className="text-base relative top-5"
            >
              <div className="flex relative right-5 mt-5">
                <BsFillReplyAllFill className="mr-1 mt-1" />
                {displayName} replied
              </div>
              <div
                style={{
                  color: "rgb(107 114 128)",
                  border: "1px solid rgb(107 114 128)",
                  width: "max-content",
                  padding: "20px",
                  borderRadius: "10px 10px 0 10px",
                }}
                className="mr-24 text-base relative"
              >
                message has been deleted
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div style={{ float: "right" }}>
          <div
            className="p-2 rounded-xl mr-20"
            style={{
              width: text?.length > 80 ? "800px" : "max-content",
              backgroundColor: backgroundColorMessageMe,
            }}
          >
            <div className="flex">
              <Avatar src={photoURL} className="font-semibold text-xl">
                {photoURL ? "" : displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                className="font-semibold text-base ml-1 mt-1"
                style={{ fontFamily: "Helvetica", color: "#EEE" }}
              >
                {displayName}
              </Typography>
              <Typography className="text-xs mt-[7px] ml-2" style={{ color: "#DDD" }}>
                {formatDate(createAt)}
              </Typography>
            </div>
            <Typography className="ml-9 text-lg" style={{ fontFamily: "Helvetica", color: "#EEE" }}>
              {text}
            </Typography>
            <Image src={imgSrc} width={200} alt="" />
          </div>
          <div className="relative bottom-4 left-4 w-52">
            <Emotion emotions={emotions} />
          </div>
        </div>
        <div className="flex mr-3" style={{ float: "right" }}>
          <MessageOptionMe messageId={messageId} />
          <MessageEmotion messageId={messageId} placement={"bottomRight"} />
        </div>
      </div>
    </>
  );
}
export function MessageMeDeleted() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColorMessageDeletedMe = user?.mode === "LIGHT" ? "#EEE" : "rgb(17, 17, 17)";
  return (
    <div>
      <div
        style={{
          backgroundColor: backgroundColorMessageDeletedMe,
          color: "rgb(107 114 128)",
          float: "right",
          fontFamily: "Helvetica",
          border: "1px solid rgb(107 114 128)",
        }}
        className="ml-5 p-5 rounded-xl mr-20 text-base mt-5"
      >
        message has been deleted
      </div>
    </div>
  );
}

export function MessageYouDeleted() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const backgroundColorMessageDeletedYou = user?.mode === "LIGHT" ? "#EEE" : "rgb(17, 17, 17)";
  return (
    <div>
      <div
        style={{
          backgroundColor: backgroundColorMessageDeletedYou,
          color: "rgb(107 114 128)",
          fontFamily: "Helvetica",
          border: "1px solid rgb(107 114 128)",
          width: "max-content",
        }}
        className="mb-5 ml-10 p-5 rounded-xl text-base"
      >
        message has been deleted
      </div>
    </div>
  );
}

export function ReplyMessage() {
  const messageReply = useSelector((state) => state.messages?.replyMessage);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const dispatch = useDispatch();
  const handleCloseReplyMessage = () => {
    dispatch(MessagesSlice.actions.replyMessage(null));
  };
  return (
    messageReply && (
      <div style={{ borderTop: "1px solid rgb(107 114 128)" }} className="flex justify-between">
        <div style={{ overflow: "hidden" }}>
          <div
            style={{ color: user.mode === "LIGHT" ? "#111" : "#EEE", fontFamily: "Helvetica" }}
            className="text-base ml-4 p-1 font-semibold"
          >
            Replying to {messageReply?.displayName}
          </div>
          <div
            style={{ color: user.mode === "LIGHT" ? "#333" : "#CCC", fontFamily: "Helvetica" }}
            className="text-base ml-5"
          >
            {messageReply?.text}
          </div>
        </div>
        <div
          className="text-2xl relative right-5 top-1 cursor-pointer"
          style={{
            color: "rgb(107 114 128)",
          }}
          onClick={handleCloseReplyMessage}
        >
          <TiDeleteOutline />
        </div>
      </div>
    )
  );
}
