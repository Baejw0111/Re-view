import { createSlice } from "@reduxjs/toolkit";
import { LoginUserInfo } from "@/shared/types/interface";

const initialState: LoginUserInfo = {
  isSignedUp: false,
  aliasId: "",
  nickname: "",
  profileImage: "",
  notificationCheckTime: "",
  agreedTermVersion: 0,
  agreedPrivacyVersion: 0,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.isSignedUp = action.payload.isSignedUp;
      state.aliasId = action.payload.aliasId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.notificationCheckTime = action.payload.notificationCheckTime;
      state.agreedTermVersion = action.payload.agreedTermVersion;
      state.agreedPrivacyVersion = action.payload.agreedPrivacyVersion;
    },
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
