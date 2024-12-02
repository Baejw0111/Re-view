import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { setScrollState } from "@/state/store/scrollStateSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "@/shared/types/interface";
import { getLoginUserInfo } from "@/api/auth";
import { API_URL } from "@/shared/constants";
import useAuth from "@/shared/hooks/useAuth";
import Header from "./widgets/Header";
import ReviewDetailModal from "./pages/ReviewDetailModal";
import SearchDialog from "./features/common/SearchDialog";

function App() {
  // 새로고침 시 로그인 유지를 위해 사용자 정보 조회
  const isAuth = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["loggedInUserInfo"],
    queryFn: getLoginUserInfo,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  });

  useEffect(() => {
    if (isAuth) {
      if (userInfo) {
        if (!userInfo?.nickname && window.location.pathname !== "/onboarding") {
          window.location.href = `/onboarding`;
        } else {
          dispatch(setUserInfo(userInfo));
        }
      }
    }
  }, [isAuth, userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY) {
        setIsScrollingUp(false);
      }
      setLastScrollY(currentScrollY);
      dispatch(setScrollState(isScrollingUp));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 알림 스트림 연결
  useEffect(() => {
    if (isAuth) {
      const eventSource = new EventSource(`${API_URL}/notification/stream`, {
        withCredentials: true,
      });

      eventSource.onmessage = () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] }); // 새로운 알림이 올 때마다 fetchNotifications API 요청
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isAuth, queryClient]);

  return (
    <>
      <Header />
      <ReviewDetailModal />
      <SearchDialog />
    </>
  );
}

export default App;
