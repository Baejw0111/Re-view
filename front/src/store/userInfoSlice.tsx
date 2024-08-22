import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "@/util/interface";
import { PURGE } from "redux-persist";

const initialState: UserInfo = {
  nickname: "",
  profileImage: "",
  thumbnailImage: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.thumbnailImage = action.payload.thumbnailImage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state.nickname = "";
      state.profileImage = "";
      state.thumbnailImage = "";
    });
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
