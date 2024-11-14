import { createSlice } from "@reduxjs/toolkit";

const searchDialogOpenSlice = createSlice({
  name: "searchDialogOpen",
  initialState: {
    isSearchDialogOpen: false,
  },
  reducers: {
    setIsSearchDialogOpen: (state, action) => {
      state.isSearchDialogOpen = action.payload;
    },
  },
});

export const { setIsSearchDialogOpen } = searchDialogOpenSlice.actions;
export default searchDialogOpenSlice.reducer;
