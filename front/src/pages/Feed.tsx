import CardList from "@/widgets/CardList";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useLocation, useLoaderData } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLatestFeed, fetchPopularFeed } from "@/api/review";
import { ReviewInfo } from "@/shared/types/interface";

export default function Feed() {
  const { pathname } = useLocation();
  const initialData = useLoaderData() as ReviewInfo[];
  const queryClient = useQueryClient();

  // initialData 캐싱
  if (initialData) {
    initialData.forEach((item) => {
      queryClient.setQueryData(["reviewInfo", item.aliasId], item);
    });
  }

  const getQueryFn = (path: string) => {
    switch (path) {
      case "/":
      case "/latest":
        // 최신 피드 조회 및 캐싱
        return async ({ pageParam }: { pageParam: string }) => {
          const data = await fetchLatestFeed(pageParam);
          data.forEach((item) => {
            queryClient.setQueryData(["reviewInfo", item.aliasId], item);
          });
          return data;
        };
      case "/popular":
        // 인기 피드 조회 및 캐싱
        return async ({ pageParam }: { pageParam: string }) => {
          const data = await fetchPopularFeed(pageParam);
          data.forEach((item) => {
            queryClient.setQueryData(["reviewInfo", item.aliasId], item);
          });
          return data;
        };
    }
  };

  const {
    data: feedData,
    isSuccess,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", pathname === "/popular" ? "popular" : "latest"],
    initialPageParam: "",
    queryFn: getQueryFn(pathname),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1].aliasId;
    },
    initialData: initialData
      ? { pages: [initialData], pageParams: [""] }
      : undefined,
    enabled: !!pathname,
  });

  return (
    <PageTemplate>
      {isSuccess && (
        <CardList
          infoList={feedData.pages.flatMap((page) => page)}
          callback={fetchNextPage}
          cardType="review"
        />
      )}
    </PageTemplate>
  );
}
