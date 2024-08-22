import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import ThemeProvider from "./components/theme/ThemeProvider";
import Feed from "./pages/Feed";
import Test from "./pages/Test";
import Header from "./components/Header";
import Review from "./pages/Review";
import Authorization from "./pages/Authorization";
import store from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";

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
                <Route path="/review" element={<Review />} />
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
