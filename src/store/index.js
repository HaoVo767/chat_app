import { configureStore } from '@reduxjs/toolkit';
import { LoginSlice } from '../components/Login/LoginSlice';
export const store = configureStore({
    reducer: {
        user: LoginSlice.reducer,
    }
})