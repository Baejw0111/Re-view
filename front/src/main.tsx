import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import App from "@/App.tsx";
import ThemeProvider from "@/state/theme/ThemeProvider";
import store from "@/state/store";
import LoginRequiredRoute from "./pages/LoginRequiredRoute";
import Feed from "@/pages/Feed";
import WriteReview from "@/pages/WriteReview";
import Authorization from "@/pages/Authorization";
import Onboarding from "@/pages/Onboarding";
import EditReview from "@/pages/EditReview";
import Profile from "@/pages/Profile";
import Notification from "@/pages/Notification";
import Search from "@/pages/Search";
import { fetchNotifications } from "./api/notification";
import { fetchLatestFeed, fetchPopularFeed } from "./api/review";
import NotFoundError from "./pages/NotFoundError";
import ConnectionError from "./pages/ConnectionError";
import PostsTab from "@/widgets/PostsTab";
import CommentsTab from "@/widgets/CommentsTab";
import LikedTab from "@/widgets/LikedTab";
import {
  fetchUserCommentList,
  fetchUserLikedList,
  fetchUserReviewList,
} from "./api/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter(
  [
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
          path: "/profile/:id",
          element: <Profile />,
          errorElement: <NotFoundError />,
          children: [
            {
              path: "",
              loader: async ({ params }) => {
                const initialData = await fetchUserReviewList(
                  Number(params.id),
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
                  Number(params.id),
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
                  Number(params.id)
                );
                return initialData;
              },
              element: <CommentsTab />,
            },
            {
              path: "liked",
              loader: async ({ params }) => {
                const initialData = await fetchUserLikedList(
                  Number(params.id),
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
        {
          path: "*",
          element: <NotFoundError />,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider
            future={{ v7_startTransition: true }}
            router={router}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
