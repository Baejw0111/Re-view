import { createSlice } from "@reduxjs/toolkit";

const notificationOpenSlice = createSlice({
  name: "notificationOpen",
  initialState: {
    isNotificationOpen: false,
  },
  reducers: {
    setIsNotificationOpen: (state, action) => {
      state.isNotificationOpen = action.payload;
    },
  },
});

export const { setIsNotificationOpen } = notificationOpenSlice.actions;
export default notificationOpenSlice.reducer;
