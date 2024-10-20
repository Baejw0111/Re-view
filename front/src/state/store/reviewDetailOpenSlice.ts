import { createSlice } from "@reduxjs/toolkit";

const reviewDetailOpenSlice = createSlice({
  name: "reviewDetailOpen",
  initialState: {
    isReviewDetailOpen: false,
  },
  reducers: {
    setIsReviewDetailOpen: (state, action) => {
      state.isReviewDetailOpen = action.payload;
    },
  },
});

export const { setIsReviewDetailOpen } = reviewDetailOpenSlice.actions;
export default reviewDetailOpenSlice.reducer;
