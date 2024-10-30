import Reviews from "@/widgets/Reviews";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestFeed, fetchPopularFeed } from "@/api/review";
import { useLocation } from "react-router-dom";

export default function Feed() {
  const { pathname } = useLocation();

  const getQueryFn = (path: string) => {
    switch (path) {
      case "/":
      case "/latest":
        return ({ pageParam }: { pageParam: string }) =>
          fetchLatestFeed(pageParam);
      case "/popular":
        return ({ pageParam }: { pageParam: string }) =>
          fetchPopularFeed(pageParam);
    }
  };

  const {
    data: feedData,
    isSuccess,
    isLoading,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["feed", pathname === "/popular" ? "popular" : "latest"],
    initialPageParam: "",
    queryFn: getQueryFn(pathname),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!pathname,
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <PageTemplate pageName="피드">
      {isSuccess && (
        <Reviews
          key={pathname}
          reviewIdList={feedData.pages.flatMap((page) => page)}
          callback={fetchNextPage}
        />
      )}
    </PageTemplate>
  );
}
