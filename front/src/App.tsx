import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { setScrollState } from "@/state/store/scrollStateSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "@/shared/types/interface";
import { getLoginUserInfo } from "@/api/auth";
import useAuth from "@/shared/hooks/useAuth";
import Header from "@/widgets/Header";
import ReviewDetailModal from "@/pages/ReviewDetailModal";
import SearchDialog from "@/features/common/SearchDialog";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginRequiredRoute from "./pages/LoginRequiredRoute";
import Feed from "@/pages/Feed";
import Test from "@/pages/Test";
import WriteReview from "@/pages/WriteReview";
import Authorization from "@/pages/Authorization";
import Onboarding from "@/pages/Onboarding";
import EditReview from "@/pages/EditReview";
import Profile from "@/pages/Profile";
import Notification from "@/pages/Notification";
import Search from "@/pages/Search";
import { API_URL } from "@/shared/constants";
import { fetchNotifications } from "./api/notification";
import { fetchLatestFeed, fetchPopularFeed } from "./api/review";
import NotFoundError from "./pages/NotFoundError";
import ConnectionError from "./pages/ConnectionError";
import PostsTab from "@/widgets/PostsTab";
import CommentsTab from "@/widgets/CommentsTab";
import LikedTab from "@/widgets/LikedTab";

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

  const router = createBrowserRouter([
    {
      element: (
        <>
          <Header isAuth={isAuth} />
          <ReviewDetailModal />
          <SearchDialog />
        </>
      ),
      children: [
        {
          path: "/",
          element: <Feed />,
          errorElement: <ConnectionError />,
          loader: async () => {
            const initialData = await fetchLatestFeed("");
            return initialData;
          },
        },
        {
          path: "/latest",
          element: <Feed />,
          errorElement: <ConnectionError />,
          loader: async () => {
            const initialData = await fetchLatestFeed("");
            return initialData;
          },
        },
        {
          path: "/popular",
          element: <Feed />,
          errorElement: <ConnectionError />,
          loader: async () => {
            const initialData = await fetchPopularFeed("");
            return initialData;
          },
        },
        {
          path: "/write",
          element: (
            <LoginRequiredRoute isAuth={isAuth}>
              <WriteReview />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "/edit",
          element: (
            <LoginRequiredRoute isAuth={isAuth}>
              <EditReview />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "/profile/:id",
          element: <Profile />,
          children: [
            {
              path: "",
              element: <PostsTab />,
            },
            {
              path: "posts",
              element: <PostsTab />,
            },
            {
              path: "comments",
              element: <CommentsTab />,
            },
            {
              path: "liked",
              element: <LikedTab />,
            },
          ],
        },
        {
          path: "/notifications",
          loader: async () => {
            try {
              if (isAuth) {
                const notifications = await fetchNotifications();
                return notifications;
              }

              return [];
            } catch (error) {
              return [];
            }
          },
          element: (
            <LoginRequiredRoute isAuth={isAuth}>
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
        {
          path: "/oauth/kakao",
          element: <Authorization />,
        },
        {
          path: "/onboarding",
          element: (
            <LoginRequiredRoute isAuth={isAuth}>
              <Onboarding />
            </LoginRequiredRoute>
          ),
        },
        {
          path: "*",
          element: <NotFoundError />,
        },
      ],
    },
  ]);

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

  return <RouterProvider router={router} />;
}

export default App;
