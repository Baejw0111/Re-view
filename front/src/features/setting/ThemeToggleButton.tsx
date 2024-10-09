import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/shadcn-ui/button";
import { useTheme } from "@/state/theme/useTheme";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <TooltipWrapper tooltipText="테마">
      <Button
        className="shrink-0"
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : null}
        {theme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : null}
      </Button>
    </TooltipWrapper>
  );
}
