import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatRoom = createAsyncThunk('chat/room', async (receiver, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `/api/chat/room/`,
            receiver,
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const fetchMessage = createAsyncThunk('chat/message', async (roomName, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/chat/messages/${roomName}/`,
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatRoom: null,
        chatRoomStatus: "idle",
        chatRoomError: null,

        message: null,
        messageStatus: "idle",
        messageError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRoom.pending, (state) => {
                state.chatRoomStatus = "loading";
            })
            .addCase(fetchChatRoom.fulfilled, (state, action) => {
                state.chatRoomStatus = "succeeded";
                state.chatRoom = action.payload;
            })
            .addCase(fetchChatRoom.rejected, (state, action) => {
                state.chatRoomStatus = "failed";
                state.chatRoomError = action.payload;
            })

            .addCase(fetchMessage.pending, (state) => {
                state.messageStatus = "loading";
            })
            .addCase(fetchMessage.fulfilled, (state, action) => {
                state.messageStatus = "succeeded";
                state.message = action.payload;
            })
            .addCase(fetchMessage.rejected, (state, action) => {
                state.messageStatus = "failed";
                state.messageError = action.payload;
            })
    },
});

export default chatSlice.reducer;