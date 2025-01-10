import { createSlice } from "@reduxjs/toolkit";
import { LoginUserInfo } from "@/shared/types/interface";

const initialState: LoginUserInfo = {
  aliasId: "",
  nickname: "",
  profileImage: "",
  notificationCheckTime: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.aliasId = action.payload.aliasId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.notificationCheckTime = action.payload.notificationCheckTime;
    },
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
