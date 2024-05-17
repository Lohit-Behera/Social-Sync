import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import TextPostSlice from "@/features/TextPostSlice";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
        user: UserSlice,
        textPost: TextPostSlice
    }
})

export default store