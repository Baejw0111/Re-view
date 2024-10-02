import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "@/state/store/userInfoSlice";
import reviewDetailOpenReducer from "@/state/store/reviewDetailOpenSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    reviewDetailOpen: reviewDetailOpenReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
