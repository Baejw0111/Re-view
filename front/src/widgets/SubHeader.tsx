import { useLocation, useSearchParams } from "react-router-dom";
import { Tabs, TabsTrigger, TabsList } from "@/shared/shadcn-ui/tabs";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useScrollDirection } from "@/shared/hooks";
import { Search } from "lucide-react";
import { useMediaQuery } from "@/shared/hooks";

export default function SubHeader() {
  const isScrollingUp = useScrollDirection();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");
  const pageRoute = pathname.split("/")[1];
  const routeMap = {
    "": "피드",
    latest: "피드",
    popular: "피드",
    search: "검색 결과",
    write: "리뷰 작성",
    edit: "리뷰 수정",
    notifications: "모든 알림",
    profile: "프로필",
    test: "테스트",
  };
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {window.location.pathname !== "/oauth/kakao" && (
        <div
          className={`sticky left-0 z-40 w-full backdrop-blur-xl supports-[backdrop-filter]:bg-primary-foreground/40 transition-all duration-300 ease-in-out
            ${isMobile ? "top-0" : "top-16"}
            ${
              isScrollingUp
                ? "translate-y-0"
                : isMobile
                ? "-translate-y-full"
                : "-translate-y-16"
            }
          `}
        >
          <div className="flex items-center h-14 md:h-16 justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2 md:py-4 border-b border-border">
            <h1 className="text-2xl md:text-3xl font-bold line-clamp-1 mr-4">
              {pageRoute === "search" ? (
                <div className="flex items-center">
                  <Search className="h-6 w-6 md:h-8 md:w-8 shrink-0 mr-2" />
                  <span className="line-clamp-1">"{searchQuery}</span>
                  <span>"</span>
                </div>
              ) : (
                `${routeMap[pageRoute as keyof typeof routeMap]}`
              )}
            </h1>
            {routeMap[pageRoute as keyof typeof routeMap] === "피드" && (
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
            {routeMap[pageRoute as keyof typeof routeMap] === "검색 결과" && (
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
      )}
    </>
  );
}
