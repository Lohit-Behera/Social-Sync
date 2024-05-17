import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCreateTextPost = createAsyncThunk('create/textPost', async (textPost, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            '/api/post/create/text/post/',
            textPost,
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


export const fetchGetTextPost = createAsyncThunk('get/textPost', async (id, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `/api/post/get/text/post/${id}/`,
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

export const textPostSlice = createSlice({
    name: "textPost",
    initialState: {
        createTextPost: {},
        createTextPostStatus: 'idle',
        createTextPostError: null,

        getTextPost: {},
        getTextPostStatus: 'idle',
        getTextPostError: null,
    },
    reducers: {
        resetCreateTextPost: (state) => {
            state.createTextPost = {};
            state.createTextPostStatus = 'idle';
            state.createTextPostError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateTextPost.pending, (state) => {
                state.createTextPostStatus = 'loading';
            })
            .addCase(fetchCreateTextPost.fulfilled, (state, action) => {
                state.createTextPostStatus = 'succeeded';
                state.createTextPost = action.payload;
            })
            .addCase(fetchCreateTextPost.rejected, (state, action) => {
                state.createTextPostStatus = 'failed';
                state.createTextPostError = action.payload;
            })

            .addCase(fetchGetTextPost.pending, (state) => {
                state.getTextPostStatus = 'loading';
            })
            .addCase(fetchGetTextPost.fulfilled, (state, action) => {
                state.getTextPostStatus = 'succeeded';
                state.getTextPost = action.payload;
            })
            .addCase(fetchGetTextPost.rejected, (state, action) => {
                state.getTextPostStatus = 'failed';
                state.getTextPostError = action.payload;
            })
    },
});

export const { resetCreateTextPost } = textPostSlice.actions;
export default textPostSlice.reducer;