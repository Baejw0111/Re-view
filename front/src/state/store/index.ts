import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "@/state/store/userInfoSlice";
import notificationOpenReducer from "@/state/store/notificationOpenSlice";
import searchDialogOpenReducer from "@/state/store/searchDialogOpenSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    notificationOpen: notificationOpenReducer,
    searchDialogOpen: searchDialogOpenReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
