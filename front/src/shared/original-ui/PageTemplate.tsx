import { useLocation } from "react-router-dom";
import WriteReviewButton from "@/features/review/WriteReviewButton";
import { useScrollDirection } from "@/shared/hooks";
import { Tabs, TabsTrigger, TabsList } from "@/shared/shadcn-ui/tabs";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function PageTemplate({
  pageName,
  children,
}: {
  pageName: string;
  children: React.ReactNode;
}) {
  const isScrollingUp = useScrollDirection();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`sticky top-16 left-0 z-40 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-primary-foreground/40 transition-all duration-300 ease-in-out ${
          isScrollingUp ? "translate-y-0" : "-translate-y-16"
        }`}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2 md:py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{pageName}</h1>
            {pageName === "피드" && (
              <Tabs
                defaultValue="latest"
                value={
                  pathname.split("/")[1] === "popular" ? "popular" : "latest"
                }
              >
                <TabsList>
                  <Link
                    to="/latest"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["feed", "latest"],
                      })
                    }
                  >
                    <TabsTrigger value="latest">최신글</TabsTrigger>
                  </Link>
                  <Link
                    to="/popular"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["feed", "popular"],
                      })
                    }
                  >
                    <TabsTrigger value="popular">인기글</TabsTrigger>
                  </Link>
                </TabsList>
              </Tabs>
            )}
          </div>
          {pageName === "피드" && <WriteReviewButton />}
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </>
  );
}
