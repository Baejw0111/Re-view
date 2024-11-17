import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeProvider from "@/state/theme/ThemeProvider";
import Feed from "@/pages/Feed";
import Test from "@/pages/Test";
import Header from "@/widgets/Header";
import WriteReview from "@/pages/WriteReview";
import Authorization from "@/pages/Authorization";
import ReviewDetailModal from "@/pages/ReviewDetailModal";
import Onboarding from "@/pages/Onboarding";
import EditReview from "@/pages/EditReview";
import Profile from "@/pages/Profile";
import Notification from "@/pages/Notification";
import Search from "@/pages/Search";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { API_URL } from "./shared/constants";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/shared/types/interface";
import SearchDialog from "./features/common/SearchDialog";

function App() {
  // 새로고침 시 로그인 유지를 위해 사용자 정보 조회
  const dispatch = useDispatch();
  const fetchUserInfoForPageReload = async () => {
    const { data } = await axios.get(`${API_URL}/auth/kakao/user`, {
      withCredentials: true,
    });

    return data.userInfo;
  };

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["loggedInUserInfo"],
    queryFn: fetchUserInfoForPageReload,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <ReactQueryDevtools initialIsOpen={false} />
        <Header />
        <ReviewDetailModal />
        <SearchDialog />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/latest" element={<Feed />} />
          <Route path="/popular" element={<Feed />} />
          <Route path="/oauth/kakao" element={<Authorization />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/write" element={<WriteReview />} />
          <Route path="/edit" element={<EditReview />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/search" element={<Search />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
