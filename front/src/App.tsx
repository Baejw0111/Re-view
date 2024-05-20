import Review from "./Review";
import "./App.css";
import ThemeProvider from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeToggle />
      <Review />
    </ThemeProvider>
  );
}

export default App;
