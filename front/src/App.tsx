import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "@/shared/types/interface";
import SearchDialog from "./features/common/SearchDialog";
import useAuth from "@/shared/hooks/useAuth";
import { getLoginUserInfo } from "@/api/auth";
import { API_URL } from "@/shared/constants";
import LoginRequiredRoute from "./pages/LoginRequiredRoute";
import { fetchNotifications } from "./api/notification";
import { fetchLatestFeed, fetchPopularFeed } from "./api/review";
import axios from "axios";

function App() {
  // 새로고침 시 로그인 유지를 위해 사용자 정보 조회
  const dispatch = useDispatch();
  const isAuth = useAuth();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["loggedInUserInfo"],
    queryFn: getLoginUserInfo,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  });

  useEffect(() => {
    if (userInfo) {
      if (!userInfo.nickname && window.location.pathname !== "/onboarding") {
        window.location.href = `/onboarding`;
      } else {
        dispatch(setUserInfo(userInfo));
      }
    }
  }, [userInfo]);

  // 알림 스트림 연결
  useEffect(() => {
    if (userInfo && userInfo.kakaoId) {
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
  }, [userInfo, queryClient]);

  const loginCheck = async () => {
    try {
      const userInfo = await axios.get(`${API_URL}/auth/kakao/check`, {
        withCredentials: true,
      });
      return userInfo;
    } catch (error) {
      return null;
    }
  };

  const router = createBrowserRouter([
    {
      loader: loginCheck,
      element: (
        <>
          <Header />
          <ReviewDetailModal />
          <SearchDialog />
        </>
      ),
      children: [
        {
          path: "/",
          element: <Feed />,
          loader: async () => {
            const initialData = await fetchLatestFeed("");
            return initialData;
          },
        },
        {
          path: "/latest",
          element: <Feed />,
          loader: async () => {
            const initialData = await fetchLatestFeed("");
            return initialData;
          },
        },
        {
          path: "/popular",
          element: <Feed />,
          loader: async () => {
            const initialData = await fetchPopularFeed("");
            return initialData;
          },
        },
        {
          path: "/write",
          loader: loginCheck,
          element: (
            <LoginRequiredRoute>
              <WriteReview />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "/edit",
          element: (
            <LoginRequiredRoute>
              <EditReview />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "/profile/:id/*",
          element: <Profile />,
        },
        {
          path: "/notifications",
          loader: async () => {
            const notifications = await fetchNotifications();
            return notifications;
          },
          element: (
            <LoginRequiredRoute>
              <Notification />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/test",
          element: <Test />,
        },
      ],
    },
    {
      path: "/oauth/kakao",
      element: <Authorization />,
    },
    {
      path: "/onboarding",
      element: (
        <LoginRequiredRoute>
          <Onboarding />
        </LoginRequiredRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}

export default App;
