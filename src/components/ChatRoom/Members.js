import React, { useContext } from "react";
import { Avatar } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";
import { BsAwardFill } from "react-icons/bs";

export default function Members({ member }) {
  const { selectedRoom } = useContext(AppContext);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleDeleteMember = () => {
    const currentRoomId = sessionStorage.getItem("roomId");
    const roomRef = db.collection("rooms").doc(currentRoomId);
    roomRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const newListMembers = doc.data().members.filter((currentMember) => member.uid !== currentMember);
          roomRef.update({
            members: [...newListMembers],
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex">
          <div>
            {selectedRoom?.host === member.uid && (
              <BsAwardFill className="text-2xl relative top-2 right-3 text-yellow-500" />
            )}
          </div>
          <div className="flex">
            <div>
              <Avatar
                src={member.photoURL}
                className="font-semibold text-2xl bg-slate-100"
                size="large"
                style={{ marginLeft: selectedRoom?.host === member.uid ? "0px" : "24px" }}
              >
                {member.photoURL ? "" : member?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <div className="mt-1 ml-2 text-lg font-semibold">{member.displayName}</div>
          </div>
        </div>
        {user.uid !== member.uid && user.uid === selectedRoom?.host && (
          <div className="mr-6 mt-2 cursor-pointer" onClick={handleDeleteMember}>
            Delete
          </div>
        )}
        {selectedRoom?.host === member.uid && <div className="mr-6 mt-2">Host</div>}
      </div>
    </>
  );
}
