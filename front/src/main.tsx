import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import App from "@/App.tsx";
import ThemeProvider from "@/state/theme/ThemeProvider";
import LoginRequiredRoute from "./pages/LoginRequiredRoute";
import store from "@/state/store";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const loginCheck = async () => {
  try {
    await axios.get(`${API_URL}/auth/kakao/check`, {
      withCredentials: true,
    });

    window.sessionStorage.setItem("isAuth", "true");

    return true;
  } catch (error) {
    window.sessionStorage.setItem("isAuth", "false");
    return false;
  }
};

const router = createBrowserRouter([
  {
    loader: loginCheck,
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
        path: "/profile/:id/*",
        element: <Profile />,
      },
      {
        path: "/notifications",
        loader: async () => {
          try {
            const isAuth = window.sessionStorage.getItem("isAuth") === "true";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
