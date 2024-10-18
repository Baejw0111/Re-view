import { useState, useEffect } from "react";
import WriteReviewButton from "@/features/review/WriteReviewButton";

export default function PageTemplate({
  pageName,
  children,
}: {
  pageName: string;
  children: React.ReactNode;
}) {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY) {
        setIsScrollingUp(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <>
      <div
        className={`sticky top-16 left-0 z-40 w-full transition-all duration-300 ease-in-out ${
          isScrollingUp
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2 md:py-4 bg-background border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold">{pageName}</h1>
          {pageName === "피드" && <WriteReviewButton />}
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </>
  );
}
