import Reviews from "@/widgets/Reviews";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/api/review";

export default function Feed() {
  const {
    data: feedData,
    isSuccess,
    isLoading,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]._id,
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <PageTemplate pageName="피드">
      {isSuccess && (
        <Reviews
          reviewList={feedData.pages.flatMap((page) => page)}
          callback={fetchNextPage}
        />
      )}
    </PageTemplate>
  );
}
