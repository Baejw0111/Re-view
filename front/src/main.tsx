import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import App from "@/App.tsx";
import ThemeProvider from "@/state/theme/ThemeProvider";
import store from "@/state/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
