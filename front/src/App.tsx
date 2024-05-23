import "./App.css";
import Feed from "./components/Feed";
import Review from "./components/Review";
import ThemeProvider from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeToggle />
      <Feed />
      <Review />
    </ThemeProvider>
  );
}

export default App;
