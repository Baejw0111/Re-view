import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useLoaderData } from "react-router";
import CardList from "@/widgets/CardList";
import { TabsContent } from "@/shared/shadcn-ui/tabs";
import { fetchUserLikedList } from "@/api/user";
import { ReviewInfo } from "@/shared/types/interface";

export default function LikedTab() {
  // 사용자 정보 가져오기
  const { userId } = useParams();
  const initialData = useLoaderData() as ReviewInfo[];
  const queryClient = useQueryClient();

  // initialData 캐싱
  if (initialData) {
    initialData.forEach((item) => {
      queryClient.setQueryData(["reviewInfo", item.aliasId], item);
    });
  }

  // 사용자가 추천한 리뷰 가져오기
  const { data: userLikedList, fetchNextPage: fetchNextUserLikedList } =
    useInfiniteQuery({
      queryKey: ["userLikedList", userId],
      initialPageParam: "",
      queryFn: async ({ pageParam }: { pageParam: string }) => {
        const data = await fetchUserLikedList(userId as string, pageParam);
        data.forEach((item) => {
          queryClient.setQueryData(["reviewInfo", item.aliasId], item);
        });
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 20) return undefined;
        return lastPage[lastPage.length - 1].aliasId;
      },
      initialData: initialData
        ? { pages: [initialData], pageParams: [""] }
        : undefined,
    });

  return (
    <TabsContent value="liked" className="mt-6">
      {userLikedList && (
        <CardList
          infoList={userLikedList.pages.flatMap((page) => page)}
          callback={fetchNextUserLikedList}
          cardType="review"
        />
      )}
    </TabsContent>
  );
}
