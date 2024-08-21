import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfoSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
