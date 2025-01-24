import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import App from "@/App.tsx";
import ThemeProvider from "@/state/theme/ThemeProvider";
import store from "@/state/store";
import LoginRequiredRoute from "@/pages/LoginRequiredRoute";
import Feed from "@/pages/Feed";
import WriteReview from "@/pages/WriteReview";
import Authorization from "@/pages/Authorization";
import Onboarding from "@/pages/Onboarding";
import EditReview from "@/pages/EditReview";
import Profile from "@/pages/Profile";
import Notification from "@/pages/Notification";
import Search from "@/pages/Search";
import { fetchNotifications } from "@/api/notification";
import { fetchLatestFeed, fetchPopularFeed } from "@/api/review";
import NotFoundError from "@/pages/NotFoundError";
import ConnectionError from "@/pages/ConnectionError";
import PostsTab from "@/widgets/PostsTab";
import CommentsTab from "@/widgets/CommentsTab";
import LikedTab from "@/widgets/LikedTab";
import {
  fetchUserCommentList,
  fetchUserLikedList,
  fetchUserReviewList,
} from "@/api/user";
import Test from "@/pages/Test";
import Login from "@/pages/Login";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Settings from "@/pages/Settings";
import Review from "@/pages/Review";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <App />,
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
        path: "/review/:reviewId",
        element: <Review />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/write",
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
        path: "/profile/:userId",
        element: <Profile />,
        errorElement: <NotFoundError />,
        children: [
          {
            path: "",
            loader: async ({ params }) => {
              const initialData = await fetchUserReviewList(
                params.userId as string,
                ""
              );
              return initialData;
            },
            element: <PostsTab />,
          },
          {
            path: "posts",
            loader: async ({ params }) => {
              const initialData = await fetchUserReviewList(
                params.userId as string,
                ""
              );
              return initialData;
            },
            element: <PostsTab />,
          },
          {
            path: "comments",
            loader: async ({ params }) => {
              const initialData = await fetchUserCommentList(
                params.userId as string
              );
              return initialData;
            },
            element: <CommentsTab />,
          },
          {
            path: "liked",
            loader: async ({ params }) => {
              const initialData = await fetchUserLikedList(
                params.userId as string,
                ""
              );
              return initialData;
            },
            element: <LikedTab />,
          },
        ],
      },
      {
        path: "/notifications",
        loader: async () => {
          try {
            const notifications = await fetchNotifications();
            return notifications;
          } catch (error) {
            return [];
          }
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
        path: "/oauth/:provider",
        element: <Authorization />,
      },
      {
        path: "/oauth/:provider/add",
        element: <Authorization addSocialLogin={true} />,
      },
      {
        path: "/settings",
        element: (
          <LoginRequiredRoute>
            <Settings />
          </LoginRequiredRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <LoginRequiredRoute>
            <Onboarding />
          </LoginRequiredRoute>
        ),
      },
      {
        path: "/policies",
        children: [
          {
            path: "",
            element: <NotFoundError />,
          },
          {
            path: "privacy",
            element: <PrivacyPolicy />,
          },
          {
            path: "terms",
            element: <Terms />,
          },
        ],
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "*",
        element: <NotFoundError />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
