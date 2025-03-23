import { createSlice } from "@reduxjs/toolkit";

const isSignedInSlice = createSlice({
  name: "isSignedIn",
  initialState: false,
  reducers: {
    setIsSignedIn: (state, action) => action.payload,
  },
});

export default isSignedInSlice.reducer;
export const { setIsSignedIn } = isSignedInSlice.actions;
