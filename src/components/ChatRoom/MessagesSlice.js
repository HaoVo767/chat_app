import { createSlice } from "@reduxjs/toolkit";

export const MessagesSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {
    storeMessages: (state, action) => {
      state.messages = action.payload;
    },
    replyMessage: (state, action) => {
      state.replyMessage = action.payload;
    },
    addIconsMessage: (state, action) => {
      state.messageIcon = action.payload;
    },
    addIconsRoomName: (state, action) => {
      state.createRoomNameIcon = action.payload;
    },
    addIconsDescription: (state, action) => {
      state.createDescriptionIcon = action.payload;
    },
    addIconsChangeRoomName: (state, action) => {
      state.changeRoomNameIcon = action.payload;
    },
    addIconsChangeDescription: (state, action) => {
      state.changeDescriptionIcon = action.payload;
    },
    addIconsChangeDisplayName: (state, action) => {
      state.changeDisplayNameIcon = action.payload;
    },
  },
});

export const MessagesSelector = (state) => state.messages;
