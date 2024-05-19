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

export const fetchGetAllTextPost = createAsyncThunk('get/all/textPost', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            '/api/post/get/all/text/',
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

export const fetchGetUserAllTextPost = createAsyncThunk('get/user/all/textPost', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/user/${id}/`,
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
})

export const fetchDeleteTextPost = createAsyncThunk('delete/textPost', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.delete(
            `/api/post/delete/text/${id}/`,
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
})

const textPostSlice = createSlice({
    name: "textPost",
    initialState: {
        createTextPost: {},
        createTextPostStatus: 'idle',
        createTextPostError: null,

        getTextPost: {},
        getTextPostStatus: 'idle',
        getTextPostError: null,

        getAllTextPost: {},
        getAllTextPostStatus: 'idle',
        getAllTextPostError: null,

        getUserAllTextPost: {},
        getUserAllTextPostStatus: 'idle',
        getUserAllTextPostError: null,

        deleteTextPost: null,
        deleteTextPostStatus: 'idle',
        deleteTextPostError: null,
    },
    reducers: {
        resetCreateTextPost: (state) => {
            state.createTextPost = {};
            state.createTextPostStatus = 'idle';
            state.createTextPostError = null;
        },
        resetDeleteTextPost: (state) => {
            state.deleteTextPost = null;
            state.deleteTextPostStatus = 'idle';
            state.deleteTextPostError = null;
        }
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

            .addCase(fetchGetAllTextPost.pending, (state) => {
                state.getAllTextPostStatus = 'loading';
            })
            .addCase(fetchGetAllTextPost.fulfilled, (state, action) => {
                state.getAllTextPostStatus = 'succeeded';
                state.getAllTextPost = action.payload;
            })
            .addCase(fetchGetAllTextPost.rejected, (state, action) => {
                state.getAllTextPostStatus = 'failed';
                state.getAllTextPostError = action.payload;
            })

            .addCase(fetchGetUserAllTextPost.pending, (state) => {
                state.getUserAllTextPostStatus = 'loading';
            })
            .addCase(fetchGetUserAllTextPost.fulfilled, (state, action) => {
                state.getUserAllTextPostStatus = 'succeeded';
                state.getUserAllTextPost = action.payload;
            })
            .addCase(fetchGetUserAllTextPost.rejected, (state, action) => {
                state.getUserAllTextPostStatus = 'failed';
                state.getUserAllTextPostError = action.payload;
            })

            .addCase(fetchDeleteTextPost.pending, (state) => {
                state.deleteTextPostStatus = 'loading';
            })
            .addCase(fetchDeleteTextPost.fulfilled, (state, action) => {
                state.deleteTextPostStatus = 'succeeded';
                state.deleteTextPost = action.payload;
            })
            .addCase(fetchDeleteTextPost.rejected, (state, action) => {
                state.deleteTextPostStatus = 'failed';
                state.deleteTextPostError = action.payload;
            })
    },
});

export const { resetCreateTextPost, resetDeleteTextPost } = textPostSlice.actions;
export default textPostSlice.reducer;