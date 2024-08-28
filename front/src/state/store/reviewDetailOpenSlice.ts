import { createSlice } from "@reduxjs/toolkit";

const reviewDetailOpenSlice = createSlice({
  name: "reviewDetailOpen",
  initialState: {
    isOpen: false,
  },
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = reviewDetailOpenSlice.actions;
export default reviewDetailOpenSlice.reducer;
