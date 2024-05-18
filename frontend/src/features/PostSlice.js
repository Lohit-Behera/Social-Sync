import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLike = createAsyncThunk('like', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `/api/post/like/${id}/`,
            {},
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

const PostSlice = createSlice({
    name: 'post',
    initialState: {
        postLike: {},
        postLikeStatus: 'idle',
        postLikeError: null,
    },
    reducers:{
        resetLike: (state) => {
            state.postLike = {};
            state.postLikeStatus = 'idle';
            state.postLikeError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLike.pending, (state) => {
                state.postLikeStatus = 'loading';
            })
            .addCase(fetchLike.fulfilled, (state, action) => {
                state.postLikeStatus = 'succeeded';
                state.postLike = action.payload;
            })
            .addCase(fetchLike.rejected, (state, action) => {
                state.postLikeStatus = 'failed';
                state.postLikeError = action.payload;
            })
    }
})

export const { resetLike } = PostSlice.actions
export default PostSlice.reducer