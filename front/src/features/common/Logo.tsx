import { cn } from "@/shared/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary h-9", className)}
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="36"
        rx="6"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line x1="26" x2="26" y2="40" stroke="currentColor" strokeWidth="4" />
      <text
        x="14"
        y="24"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
      >
        Re
      </text>
      <text
        x="44"
        y="24"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
      >
        view
      </text>
    </svg>
  );
}
