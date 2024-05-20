import Review from "./Review";
import "./App.css";
import ThemeProvider from "./components/theme/theme-provider";
import { ModeToggle } from "./components/theme/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ModeToggle />
      <Review />
    </ThemeProvider>
  );
}

export default App;
