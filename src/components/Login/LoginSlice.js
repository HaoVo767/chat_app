import { createSlice } from '@reduxjs/toolkit';

export const LoginSlice = createSlice({
    name: 'login',
    initialState: {},
    reducers: {
        storeUser: (state, action) => {
            state.user = action.payload;
    }
    }
})

export const loginSelector = state => state.user.user;