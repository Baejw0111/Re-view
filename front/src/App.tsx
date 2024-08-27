import "@/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import ThemeProvider from "@/state/theme/ThemeProvider";
import Feed from "@/pages/Feed";
import Test from "@/pages/Test";
import Header from "@/widgets/Header";
import CreateReview from "@/pages/CreateReview";
import Authorization from "@/pages/Authorization";
import store from "@/state/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/state/store";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <ReactQueryDevtools initialIsOpen={false} />
              <Header />
              <Routes>
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Feed />} />
                <Route path="/create-review" element={<CreateReview />} />
                <Route path="/oauth/kakao" element={<Authorization />} />
              </Routes>
            </Router>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
