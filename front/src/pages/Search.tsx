import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchReviews } from "@/api/review";
import Reviews from "@/widgets/Reviews";

export default function Search() {
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");

  const {
    data: reviews,
    isSuccess,
    isLoading,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["search", "reviews", searchQuery],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      getSearchReviews(searchQuery ?? "", pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!searchQuery,
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <PageTemplate pageName={`"${searchQuery}" 검색 결과`}>
      {isSuccess && (
        <Reviews
          reviewIdList={reviews.pages.flatMap((page) => page)}
          callback={fetchNextPage}
        />
      )}
    </PageTemplate>
  );
}
