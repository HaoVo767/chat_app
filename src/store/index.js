import { configureStore } from "@reduxjs/toolkit";
import { MessagesSlice } from "../components/ChatRoom/MessagesSlice";
import { LoginSlice } from "../components/Login/LoginSlice";
export const store = configureStore({
  reducer: {
    user: LoginSlice.reducer,
    messages: MessagesSlice.reducer,
  },
});
