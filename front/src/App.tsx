import "./App.css";
import Feed from "./components/Feed";
import ReviewForm from "./components/ReviewForm";
import ThemeProvider from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeToggle />
      <Feed />
      <ReviewForm />
    </ThemeProvider>
  );
}

export default App;
