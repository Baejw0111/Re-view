import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/shadcn-ui/tooltip";
import { useMediaQuery } from "@/shared/hooks";

export default function TooltipWrapper({
  children,
  tooltipText,
  side = "bottom",
}: {
  children: React.ReactNode;
  tooltipText: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
