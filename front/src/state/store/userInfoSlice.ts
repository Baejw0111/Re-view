import { createSlice } from "@reduxjs/toolkit";

// 로그인 시 redux에 필요한 유저 정보만 저장하기 때문에 UserInfo 인터페이스 대신 객체로 직접 선언
const initialState: {
  kakaoId: number;
  nickname: string;
  profileImage: string;
} = {
  kakaoId: 0,
  nickname: "",
  profileImage: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.kakaoId = action.payload.kakaoId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
    },
  },
});

export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
