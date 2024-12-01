import { createSlice } from "@reduxjs/toolkit";

const scrollStateSlice = createSlice({
  name: "scrollState",
  initialState: {
    isScrollingUp: true,
  },
  reducers: {
    setScrollState: (state, action) => {
      state.isScrollingUp = action.payload;
    },
  },
});

export const { setScrollState } = scrollStateSlice.actions;
export default scrollStateSlice.reducer;
