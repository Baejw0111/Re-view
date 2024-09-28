import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

// 로그인 시 redux에 필요한 유저 정보만 저장하기 때문에 UserInfo 인터페이스 대신 객체로 직접 선언
const initialState: {
  kakaoId: number;
  nickname: string;
  profileImage: string;
  thumbnailImage: string;
} = {
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
