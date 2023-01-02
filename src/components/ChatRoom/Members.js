import React, { useContext, useEffect } from "react";
import { Avatar } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/configure";

export default function Members({ member }) {
  const { selectedRoom, setIsLoading, isLoading } = useContext(AppContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const handleDeleteMember = () => {
    setIsLoading(true);
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
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading, setIsLoading]);
  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <Avatar src={member.photoURL} className="font-semibold text-2xl bg-blue-500 ml-5" size="large">
            {member.photoURL ? "" : member?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <span className="mt-1 ml-2 text-lg font-semibold">{member.displayName}</span>
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
