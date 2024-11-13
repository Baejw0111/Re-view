import PageTemplate from "@/shared/original-ui/PageTemplate";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/shadcn-ui/tabs";
import { Grid, MessageCircle, Heart } from "lucide-react";
import { Link, Route, Routes, useParams, useLocation } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchUserCommentList,
  fetchUserReviewList,
  fetchUserLikedList,
} from "@/api/user";
import { CommentInfo } from "@/shared/types/interface";
import Reviews from "@/widgets/Reviews";
import { claculateTime } from "@/shared/lib/utils";
import UserSetting from "@/features/setting/UserSetting";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Card } from "@/shared/shadcn-ui/card";
import ProfileInfo from "@/features/user/ProfileInfo";

export default function Profile() {
  const location = useLocation();
  const loginedUserInfo = useSelector((state: RootState) => state.userInfo);

  // 사용자 정보 가져오기
  const { id: userId } = useParams();

  // 사용자가 작성한 댓글 가져오기
  const { data: userCommentList, refetch: refetchUserCommentList } = useQuery<
    CommentInfo[]
  >({
    queryKey: ["userCommentList", Number(userId)],
    queryFn: () => fetchUserCommentList(Number(userId)),
  });

  // 사용자가 작성한 리뷰 가져오기
  const {
    data: userReviewList,
    fetchNextPage: fetchNextUserReviewList,
    refetch: refetchUserReviewList,
  } = useInfiniteQuery({
    queryKey: ["userReviewList", Number(userId)],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      fetchUserReviewList(Number(userId), pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
  });

  // 사용자가 추천한 리뷰 가져오기
  const {
    data: userLikedList,
    fetchNextPage: fetchNextUserLikedList,
    refetch: refetchUserLikedList,
  } = useInfiniteQuery({
    queryKey: ["userLikedList", Number(userId)],
    initialPageParam: "",
    queryFn: ({ pageParam }: { pageParam: string }) =>
      fetchUserLikedList(Number(userId), pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1];
    },
  });

  return (
    <PageTemplate pageName="프로필">
      <Card className="flex justify-center p-8 max-w-xl mx-auto relative">
        <ProfileInfo userId={Number(userId)} tags profileImageSize="lg" />
        {loginedUserInfo.kakaoId === Number(userId) && (
          <div className="absolute right-8 top-8 md:right-8 md:top-8">
            <UserSetting />
          </div>
        )}
      </Card>

      <Tabs
        defaultValue="posts"
        value={
          !location.pathname.split("/")[3] // 경로에 따라 기본값 설정
            ? "posts" // 기본값은 posts
            : location.pathname.split("/")[3]
        }
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-3 md:max-w-xl mx-auto">
          <TabsTrigger className="w-full" value="posts" asChild>
            <Link to="posts" onClick={() => refetchUserReviewList()}>
              <Grid className="h-4 w-4 mr-2" /> 리뷰
            </Link>
          </TabsTrigger>
          <TabsTrigger className="w-full" value="comments" asChild>
            <Link to="comments" onClick={() => refetchUserCommentList()}>
              <MessageCircle className="h-4 w-4 mr-2" /> 댓글
            </Link>
          </TabsTrigger>
          <TabsTrigger className="w-full" value="liked" asChild>
            <Link to="liked" onClick={() => refetchUserLikedList()}>
              <Heart className="text-red-500 fill-red-500 h-4 w-4 mr-2" /> 추천
            </Link>
          </TabsTrigger>
        </TabsList>

        <Routes>
          <Route
            path=""
            element={
              <TabsContent value="posts" className="mt-6">
                {userReviewList && (
                  <Reviews
                    reviewIdList={userReviewList.pages.flatMap((page) => page)}
                    callback={fetchNextUserReviewList}
                  />
                )}
              </TabsContent>
            }
          />
          <Route
            path="posts"
            element={
              <TabsContent value="posts" className="mt-6">
                {userReviewList && (
                  <Reviews
                    reviewIdList={userReviewList.pages.flatMap((page) => page)}
                    callback={fetchNextUserReviewList}
                  />
                )}
              </TabsContent>
            }
          />
          <Route
            path="comments"
            element={
              <TabsContent value="comments" className="mt-6 max-w-xl mx-auto">
                <div className="bg-background rounded-lg">
                  {userCommentList &&
                    userCommentList.map((commentInfo, index) => (
                      <div
                        key={index}
                        className="border-b last:border-b-0 p-4 flex justify-between"
                      >
                        <Link
                          to={`/?reviewId=${commentInfo.reviewId}&commentId=${commentInfo._id}`}
                          className="hover:underline text-sm whitespace-pre-wrap break-all"
                        >
                          {commentInfo.content}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {claculateTime(commentInfo.uploadTime)}
                        </span>
                      </div>
                    ))}
                </div>
              </TabsContent>
            }
          />
          <Route
            path="liked"
            element={
              <TabsContent value="liked" className="mt-6">
                {userLikedList && (
                  <Reviews
                    reviewIdList={userLikedList.pages.flatMap((page) => page)}
                    callback={fetchNextUserLikedList}
                  />
                )}
              </TabsContent>
            }
          />
        </Routes>
      </Tabs>
    </PageTemplate>
  );
}
