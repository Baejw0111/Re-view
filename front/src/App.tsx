import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeProvider from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";
import Feed from "./pages/Feed";
import Test from "./pages/Test";
import Menu from "./components/Menu";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ThemeToggle />
        <Router>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="flex">
            <div className="flex-none w-48">
              <Menu />
            </div>
            <div className="flex-1 flex justify-center">
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/test" element={<Test />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
