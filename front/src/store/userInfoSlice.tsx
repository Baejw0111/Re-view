import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "@/util/interface";

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
    clearUserInfo: (state) => {
      state.nickname = "";
      state.profileImage = "";
      state.thumbnailImage = "";
    },
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
