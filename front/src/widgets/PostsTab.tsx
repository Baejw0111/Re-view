import { TabsContent } from "@/shared/shadcn-ui/tabs";
import { useParams, useLoaderData } from "react-router";
import CardList from "@/widgets/CardList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserReviewList } from "@/api/user";
import { ReviewInfo } from "@/shared/types/interface";

export default function PostsTab() {
  const { userId } = useParams();
  const initialData = useLoaderData() as ReviewInfo[];

  // 사용자가 작성한 리뷰 가져오기
  const { data: userReviewList, fetchNextPage: fetchNextUserReviewList } =
    useInfiniteQuery({
      queryKey: ["userReviewList", userId],
      initialPageParam: "",
      queryFn: ({ pageParam }: { pageParam: string }) =>
        fetchUserReviewList(userId as string, pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 20) return undefined;
        return lastPage[lastPage.length - 1].aliasId;
      },
      initialData: initialData
        ? { pages: [initialData], pageParams: [""] }
        : undefined,
    });

  return (
    <TabsContent value="posts" className="mt-6">
      {userReviewList && (
        <CardList
          infoList={userReviewList.pages.flatMap((page) => page)}
          callback={fetchNextUserReviewList}
          cardType="review"
        />
      )}
    </TabsContent>
  );
}
