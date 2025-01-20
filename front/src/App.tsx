import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginUserInfo } from "@/shared/types/interface";
import { getLoginUserInfo } from "@/api/auth";
import useAuth from "@/shared/hooks/useAuth";
import Header from "@/widgets/Header";
import SearchDialog from "@/features/common/SearchDialog";
import SubHeader from "@/widgets/SubHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/shared/shadcn-ui/sonner";
import TermsAgreementDialog from "@/widgets/TermsAgreementDialog";
import { TERM_VERSION, PRIVACY_VERSION } from "@/shared/constants";

function App() {
  // 새로고침 시 로그인 유지를 위해 사용자 정보 조회
  const navigate = useNavigate();
  const isAuth = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isTermsAgreementDialogOpen, setIsTermsAgreementDialogOpen] =
    useState(false);

  const { data: userInfo } = useQuery<LoginUserInfo>({
    queryKey: ["loggedInUserInfo"],
    queryFn: getLoginUserInfo,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  });

  useEffect(() => {
    if (isAuth) {
      if (userInfo) {
        if (
          !userInfo.isSignedUp &&
          window.location.pathname !== "/onboarding"
        ) {
          navigate("/onboarding");
        } else {
          dispatch(setUserInfo(userInfo));
        }

        if (
          userInfo.isSignedUp &&
          (userInfo.agreedTermVersion === undefined ||
            userInfo.agreedPrivacyVersion === undefined ||
            userInfo.agreedTermVersion < TERM_VERSION ||
            userInfo.agreedPrivacyVersion < PRIVACY_VERSION)
        ) {
          setIsTermsAgreementDialogOpen(true);
        }
      }
    }
  }, [isAuth, userInfo]);

  // 알림 스트림 연결
  useEffect(() => {
    if (isAuth) {
      // const eventSource = new EventSource(`${API_URL}/notification/stream`, {
      //   withCredentials: true,
      // });

      // eventSource.onmessage = () => {
      //   queryClient.invalidateQueries({ queryKey: ["notifications"] }); // 새로운 알림이 올 때마다 fetchNotifications API 요청
      // };

      // return () => {
      //   eventSource.close();
      // };

      // 30초마다 notifications 쿼리 무효화를 통해 알림 목록 갱신
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuth, queryClient]);

  return (
    <>
      <Header />
      <SubHeader />
      <Outlet />
      <SearchDialog />
      <Toaster richColors />
      <TermsAgreementDialog open={isTermsAgreementDialogOpen} />
    </>
  );
}

export default App;
