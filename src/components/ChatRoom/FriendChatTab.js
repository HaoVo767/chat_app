import { Avatar, Col, Row, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";
import { useSelector, useDispatch } from "react-redux";
import { MessagesSlice } from "./MessagesSlice";

export default function FriendChatTab() {
  const userStore = useSelector((state) => state.user.user);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const friendChatRoomId = sessionStorage.getItem("friendChat");
  const dispatch = useDispatch();
  const friends = userStore?.friends;
  const { typeRoom, setSelectedRoomId, setFriendChatId, setSelectedFriendChatRoom, setSetFriendChatMessages } =
    useContext(AppContext);
  useEffect(() => {
    if (typeRoom === "2") {
      sessionStorage.removeItem("friendChat");
      sessionStorage.removeItem("roomId");
      setSelectedRoomId(null);
      setFriendChatId(null);
    }
  }, [typeRoom, setSelectedRoomId, setFriendChatId]);

  useEffect(() => {
    if (friendChatRoomId) {
      db.collection("friendChat")
        .doc(friendChatRoomId)
        .onSnapshot((doc) => {
          // console.log("Current data: ", doc.data());
          if (doc.data()) {
            setSetFriendChatMessages(doc.data().messages);
            let messagesCopy = [];
            doc.data().messages.map((message) => {
              messagesCopy = [...messagesCopy, { ...message, createAt: null }];
              return dispatch(MessagesSlice.actions.storeMessages(messagesCopy));
            });
          }
        });
    }
  }, [dispatch, friendChatRoomId, setSetFriendChatMessages]);
  const handleSetFriendChatRoomId = (id) => {
    if (userStore?.id) {
      db.collection("friendChat")
        .where("members", "array-contains", userStore?.id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().members.includes(id)) {
              setSelectedFriendChatRoom(doc.data());
              sessionStorage.setItem("friendChat", doc.id);
              // setSetFriendChatMessages(doc.data().messages);
              // let messagesCopy = [];
              // doc.data().messages.map((message) => {
              //   messagesCopy = [...messagesCopy, { ...message, createAt: null }];
              //   return dispatch(MessagesSlice.actions.storeMessages(messagesCopy));
              // });
            }
          });
        });
    }
    setFriendChatId(id);
  };

  return (
    <div className="h-screen" style={{ background: user?.mode === "LIGHT" ? "#EEE" : "#000" }}>
      {friends?.length > 0 &&
        friends.map((friend) => (
          <Row className="pt-3" key={friend.id}>
            <Col span={2}></Col>
            <Col span={22}>
              <Row>
                <Avatar
                  size="large"
                  src={friend?.photoURL}
                  className="text-2xl bg-slate-100 cursor-pointer"
                  onClick={() => handleSetFriendChatRoomId(friend.id)}
                ></Avatar>
                <Typography
                  style={{ fontFamily: "Helvetica", color: user?.mode === "LIGHT" ? "#111" : "#EEE" }}
                  className="text-lg mt-2 ml-2"
                >
                  {friend?.displayName}
                </Typography>
              </Row>
            </Col>
          </Row>
        ))}
    </div>
  );
}
