import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "@/shared/types/interface";
import { PURGE } from "redux-persist";

const initialState: UserInfo = {
  kakaoId: 0,
  nickname: "",
  profileImage: "",
  thumbnailImage: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.kakaoId = action.payload.kakaoId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.thumbnailImage = action.payload.thumbnailImage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state.kakaoId = 0;
      state.nickname = "";
      state.profileImage = "";
      state.thumbnailImage = "";
    });
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
