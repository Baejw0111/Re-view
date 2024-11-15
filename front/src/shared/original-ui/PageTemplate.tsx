import { useLocation, useSearchParams } from "react-router-dom";
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
  const [queryParams] = useSearchParams();

  return (
    <>
      <div
        className={`sticky top-16 left-0 z-40 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-primary-foreground/40 transition-all duration-300 ease-in-out ${
          isScrollingUp ? "translate-y-0" : "-translate-y-16"
        }`}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2 md:py-4 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold">{pageName}</h1>
          {pageName === "피드" && (
            <Tabs
              defaultValue="latest"
              value={
                pathname.split("/")[1] === "popular" ? "popular" : "latest"
              }
            >
              <TabsList>
                <TabsTrigger value="latest" asChild>
                  <Link
                    to="/latest"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["feed", "latest"],
                      })
                    }
                  >
                    최신글
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="popular" asChild>
                  <Link
                    to="/popular"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["feed", "popular"],
                      })
                    }
                  >
                    인기글
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          {pageName.includes("검색 결과") && (
            <Tabs
              defaultValue="reviews"
              value={
                queryParams.get("category") === "users" ? "users" : "reviews"
              }
            >
              <TabsList>
                <TabsTrigger value="reviews" asChild>
                  <Link
                    to={`?${new URLSearchParams({
                      ...Object.fromEntries(queryParams),
                      category: "reviews",
                    })}`}
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["search", "reviews"],
                      })
                    }
                  >
                    리뷰
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="users" asChild>
                  <Link
                    to={`?${new URLSearchParams({
                      ...Object.fromEntries(queryParams),
                      category: "users",
                    })}`}
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["search", "users"],
                      })
                    }
                  >
                    유저
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </>
  );
}
