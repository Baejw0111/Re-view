import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export default function MovingLogo({ className }: { className?: string }) {
  return (
    <a href="/feed" className="flex items-center gap-2">
      <svg
        className={cn("text-primary h-20", className)}
        viewBox="0 0 64 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          x1="0"
          x2="0"
          y1="0"
          y2="40"
          stroke="currentColor"
          strokeWidth="4"
          initial={{ x: 26 }}
          animate={{ x: [26, 62, 2, 26] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1,
          }}
        />
        <rect
          className="text-background"
          x="2"
          y="2"
          width="60"
          height="36"
          stroke="currentColor"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          width="60"
          height="36"
          rx="6"
          stroke="currentColor"
          strokeWidth="4"
        />
        <motion.text
          x="14"
          y="24"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="bold"
          fill="currentColor"
          textAnchor="middle"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          style={{ clipPath: "url(#clipPath2)" }}
        >
          Re
        </motion.text>
        <motion.text
          x="44"
          y="24"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="bold"
          fill="currentColor"
          textAnchor="middle"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          style={{ clipPath: "url(#clipPath1)" }}
        >
          view
        </motion.text>
        <defs>
          <clipPath id="clipPath1">
            <motion.rect
              x="0"
              y="0"
              width="64"
              height="40"
              initial={{ x: 26 }}
              animate={{ x: [26, 62, 2, 26] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
            />
          </clipPath>
          <clipPath id="clipPath2">
            <motion.rect
              x="0"
              y="0"
              height="40"
              initial={{ width: 0 }}
              animate={{ width: [26, 62, 2, 26] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
            />
          </clipPath>
        </defs>
      </svg>
    </a>
  );
}
