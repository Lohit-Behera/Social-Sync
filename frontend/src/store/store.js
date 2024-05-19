import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import TextPostSlice from "@/features/TextPostSlice";
import PostSlice from "@/features/PostSlice";
import UserFollowSlice from "@/features/UserFollowSlice";

import DeleteImages from "@/features/DeleteImages";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
        user: UserSlice,
        textPost: TextPostSlice,
        post: PostSlice,
        userFollow: UserFollowSlice,
        
        deleteImages: DeleteImages
    }
})

export default store