import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "@/state/store/userInfoSlice";
import reviewDetailOpenReducer from "@/state/store/reviewDetailOpenSlice";
import notificationOpenReducer from "@/state/store/notificationOpenSlice";
import searchDialogOpenReducer from "@/state/store/searchDialogOpenSlice";
import scrollStateReducer from "@/state/store/scrollStateSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    reviewDetailOpen: reviewDetailOpenReducer,
    notificationOpen: notificationOpenReducer,
    searchDialogOpen: searchDialogOpenReducer,
    scrollState: scrollStateReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
