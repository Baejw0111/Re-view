import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchReviews } from "@/api/review";
import { getSearchUsers } from "@/api/user";
import CardList from "@/widgets/CardList";

export default function Search() {
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");
  const category = queryParams.get("category") ?? "reviews";

  const {
    data: reviewList,
    isSuccess: isReviewListSuccess,
    isLoading: isReviewListLoading,
    fetchNextPage: fetchNextReviewList,
    error: reviewListError,
  } = useInfiniteQuery({
    queryKey: ["search", "reviews", searchQuery],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      getSearchReviews(searchQuery ?? "", pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!searchQuery && category === "reviews",
  });

  const {
    data: userList,
    isSuccess: isUserListSuccess,
    isLoading: isUserListLoading,
    fetchNextPage: fetchNextUserList,
    error: userListError,
  } = useInfiniteQuery({
    queryKey: ["search", "users", searchQuery],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getSearchUsers(searchQuery ?? "", pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!searchQuery && category === "users",
  });

  if (reviewListError) return <div>에러: {reviewListError.message}</div>;
  if (userListError) return <div>에러: {userListError.message}</div>;
  if (isReviewListLoading) return <div>로딩 중...</div>;
  if (isUserListLoading) return <div>로딩 중...</div>;

  return (
    <PageTemplate pageName={`"${searchQuery}" 검색 결과`}>
      {isReviewListSuccess && category === "reviews" && (
        <CardList
          idList={reviewList.pages.flatMap((page) => page)}
          callback={fetchNextReviewList}
          cardType="review"
        />
      )}
      {isUserListSuccess && category === "users" && (
        <CardList
          idList={userList.pages.flatMap((page) => page)}
          callback={fetchNextUserList}
          cardType="userProfile"
        />
      )}
    </PageTemplate>
  );
}
