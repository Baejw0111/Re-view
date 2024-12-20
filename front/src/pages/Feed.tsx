import CardList from "@/widgets/CardList";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useLoaderData } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestFeed, fetchPopularFeed } from "@/api/review";
import { useLocation } from "react-router-dom";

export default function Feed() {
  const { pathname } = useLocation();
  const initialData = useLoaderData() as string[];

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
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", pathname === "/popular" ? "popular" : "latest"],
    initialPageParam: "",
    queryFn: getQueryFn(pathname),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
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
          idList={feedData.pages.flatMap((page) => page)}
          callback={fetchNextPage}
          cardType="review"
        />
      )}
    </PageTemplate>
  );
}
