import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Menu from "./components/Menu";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeToggle />
      <Router>
        <div className="flex">
          <div className="flex-none w-48">
            <Menu />
          </div>
          <div className="flex-1 flex justify-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
