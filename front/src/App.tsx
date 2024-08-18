import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeProvider from "./components/theme/ThemeProvider";
import Feed from "./pages/Feed";
import Test from "./pages/Test";
import Header from "./components/Header";
import Review from "./pages/Review";
import Authorization from "./pages/Authorization";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
