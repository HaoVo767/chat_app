import React, { createContext, useMemo, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const initMode = user?.mode;
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedFriendChatRoom, setSelectedFriendChatRoom] = useState("");
  const [modeChange, setModeChange] = useState(initMode);
  const [typeRoom, setTypeRoom] = useState("1");
  const [friendChatId, setFriendChatId] = useState(null);
  const [friendChatMessages, setSetFriendChatMessages] = useState([]);
  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user?.uid,
    };
  }, [user?.uid]);
  const rooms = useFirestore("rooms", roomsCondition);
  const currentRoomId = sessionStorage.getItem("roomId");
  const selectedRoom = currentRoomId ? rooms.find((room) => room.id === selectedRoomId) : null;

  return (
    <AppContext.Provider
      value={{
        rooms,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        modeChange,
        setModeChange,
        typeRoom,
        setTypeRoom,
        friendChatId,
        setFriendChatId,
        selectedFriendChatRoom,
        setSelectedFriendChatRoom,
        friendChatMessages,
        setSetFriendChatMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
