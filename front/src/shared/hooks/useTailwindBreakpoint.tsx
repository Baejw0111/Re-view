import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export default function useTailwindBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const breakpoints = {
      sm: "(min-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
      xl: "(min-width: 1280px)",
      "2xl": "(min-width: 1536px)",
    };

    function updateBreakpoint() {
      if (window.matchMedia(breakpoints["2xl"]).matches) {
        setBreakpoint("2xl");
      } else if (window.matchMedia(breakpoints.xl).matches) {
        setBreakpoint("xl");
      } else if (window.matchMedia(breakpoints.lg).matches) {
        setBreakpoint("lg");
      } else if (window.matchMedia(breakpoints.md).matches) {
        setBreakpoint("md");
      } else if (window.matchMedia(breakpoints.sm).matches) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    }

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
