import WriteReviewButton from "@/features/review/WriteReviewButton";
import { useScrollDirection } from "@/shared/hooks";

export default function PageTemplate({
  pageName,
  children,
}: {
  pageName: string;
  children: React.ReactNode;
}) {
  const isScrollingUp = useScrollDirection();

  return (
    <>
      <div
        className={`sticky top-16 left-0 z-40 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 transition-all duration-300 ease-in-out ${
          isScrollingUp ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2 md:py-4 border-b border-border">
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
