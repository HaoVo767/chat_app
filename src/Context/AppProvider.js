import React, { createContext, useMemo, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const initBackgroundColor = user?.mode === "LIGHT" ? "#EEE" : "#000";
  const initTextColor = user?.mode === "LIGHT" ? "#111" : "#EEE";
  const [backgroundColor, setBackgroundColor] = useState(initBackgroundColor);
  const [textColor, setTextColor] = useState(initTextColor);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenIcons, setIsOpenIcons] = useState(false);
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
        setIsLoading,
        isLoading,
        backgroundColor,
        setBackgroundColor,
        textColor,
        setTextColor,
        isOpenIcons,
        setIsOpenIcons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
