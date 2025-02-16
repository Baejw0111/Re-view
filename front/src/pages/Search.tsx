import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useSearchParams } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { searchReviews } from "@/api/review";
import { searchUsers } from "@/api/user";
import CardList from "@/widgets/CardList";

export default function Search() {
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");
  const category = queryParams.get("category") ?? "reviews";
  const queryClient = useQueryClient();

  const {
    data: reviewList,
    isSuccess: isReviewListSuccess,
    fetchNextPage: fetchNextReviewList,
  } = useInfiniteQuery({
    queryKey: ["search", "reviews", searchQuery],
    initialPageParam: "",
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      const data = await searchReviews(searchQuery ?? "", pageParam);
      data.forEach((item) => {
        queryClient.setQueryData(["reviewInfo", item.aliasId], item);
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1].aliasId;
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
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      const data = await searchUsers(searchQuery ?? "", pageParam);
      data.forEach((item) => {
        queryClient.setQueryData(["userInfo", item.aliasId], item);
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1].aliasId;
    },
    enabled: !!searchQuery && category === "users",
  });

  return (
    <PageTemplate>
      {isReviewListSuccess && category === "reviews" && (
        <CardList
          infoList={reviewList.pages.flatMap((page) => page)}
          callback={fetchNextReviewList}
          cardType="review"
        />
      )}
      {isUserListSuccess && category === "users" && (
        <CardList
          infoList={userList.pages.flatMap((page) => page)}
          callback={fetchNextUserList}
          cardType="userProfile"
        />
      )}
    </PageTemplate>
  );
}
