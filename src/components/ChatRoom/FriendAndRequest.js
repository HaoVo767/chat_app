import { Avatar, Button, Col, Row, Typography } from "antd";
import React, { useMemo } from "react";
import { db } from "../../firebase/configure";
import { addDocument } from "../../firebase/service";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
export function Request({ displayName, photoURL, uid, userSentRequetsId, userReceiveId }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: uid,
    };
  }, [uid]);
  const userSentRequest = useFirestore("users", userCondition);
  const handleDeleteRequest = () => {
    db.collection("users")
      .doc(userReceiveId)
      .update({
        requests: user?.requests.filter((request) => request.id !== userSentRequetsId),
      });
    const updateUser = { ...user, requests: user?.requests.filter((request) => request.id !== userSentRequetsId) };
    return sessionStorage.setItem("user", JSON.stringify(updateUser));
  };
  const handleAcceptRequest = () => {
    db.collection("users")
      .doc(userReceiveId)
      .update({
        requests: user?.requests.filter((request) => request.id !== userSentRequetsId),
        friends: [
          ...user.friends,
          {
            displayName: displayName,
            photoURL: photoURL,
            id: userSentRequetsId,
          },
        ],
        listFriendsUid: [...user?.listFriendsUid, uid],
      });
    db.collection("users")
      .doc(userSentRequetsId)
      .update({
        friends: [
          ...userSentRequest[0]?.friends,
          {
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            id: userReceiveId,
          },
        ],
        listFriendsUid: [...userSentRequest[0]?.listFriendsUid, user.uid],
      });
    addDocument("friendChat", {
      members: [userSentRequetsId, userReceiveId],
      messages: [],
      uid: `${userSentRequetsId}${userReceiveId}`,
    });
  };
  return (
    <Row className="mt-5">
      <Col span={18}>
        <Row>
          <Avatar size="large" src={photoURL} className="text-2xl bg-slate-100 cursor-pointer"></Avatar>
          <Typography style={{ fontFamily: "Helvetica" }} className="text-lg mt-2 ml-2">
            {displayName}
          </Typography>
        </Row>
      </Col>
      <Col span={6}>
        <div className="flex">
          <Button className="mr-2" onClick={handleDeleteRequest}>
            Delete
          </Button>
          <Button className="text-gray-200 bg-blue-500" onClick={handleAcceptRequest}>
            Accept
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export function Friend({ displayName, photoURL, yourId, myId, uid }) {
  const navigate = useNavigate();
  return (
    <Row className="mb-3">
      <Col span={2}></Col>
      <Col span={22}>
        <Row className="cursor-pointer" onClick={() => navigate(`/user/${uid}`)}>
          <Avatar size="large" src={photoURL} className="text-2xl bg-slate-100 "></Avatar>
          <Typography style={{ fontFamily: "Helvetica" }} className="text-lg mt-2 ml-2">
            {displayName}
          </Typography>
        </Row>
      </Col>
    </Row>
  );
}
