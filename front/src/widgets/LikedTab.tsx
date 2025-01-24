import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useLoaderData } from "react-router";
import CardList from "@/widgets/CardList";
import { TabsContent } from "@/shared/shadcn-ui/tabs";
import { fetchUserLikedList } from "@/api/user";

export default function LikedTab() {
  // 사용자 정보 가져오기
  const { userId } = useParams();
  const initialData = useLoaderData() as string[];

  // 사용자가 추천한 리뷰 가져오기
  const { data: userLikedList, fetchNextPage: fetchNextUserLikedList } =
    useInfiniteQuery({
      queryKey: ["userLikedList", userId],
      initialPageParam: "",
      queryFn: ({ pageParam }: { pageParam: string }) =>
        fetchUserLikedList(userId as string, pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 20) return undefined;
        return lastPage[lastPage.length - 1];
      },
      initialData: initialData
        ? { pages: [initialData], pageParams: [""] }
        : undefined,
    });

  return (
    <TabsContent value="liked" className="mt-6">
      {userLikedList && (
        <CardList
          idList={userLikedList.pages.flatMap((page) => page)}
          callback={fetchNextUserLikedList}
          cardType="review"
        />
      )}
    </TabsContent>
  );
}
