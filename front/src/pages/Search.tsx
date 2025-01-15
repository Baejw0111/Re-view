import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchReviews } from "@/api/review";
import { searchUsers } from "@/api/user";
import CardList from "@/widgets/CardList";

export default function Search() {
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");
  const category = queryParams.get("category") ?? "reviews";

  const {
    data: reviewList,
    isSuccess: isReviewListSuccess,
    fetchNextPage: fetchNextReviewList,
  } = useInfiniteQuery({
    queryKey: ["search", "reviews", searchQuery],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      searchReviews(searchQuery ?? "", pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!searchQuery && category === "reviews",
  });

  const {
    data: userList,
    isSuccess: isUserListSuccess,
    fetchNextPage: fetchNextUserList,
  } = useInfiniteQuery({
    queryKey: ["search", "users", searchQuery],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      searchUsers(searchQuery ?? "", pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
    enabled: !!searchQuery && category === "users",
  });

  return (
    <PageTemplate>
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
