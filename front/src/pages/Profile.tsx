import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Card } from "@/shared/shadcn-ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/shadcn-ui/tabs";
import { Grid, MessageCircle, Heart } from "lucide-react";
import { Link, Route, Routes, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserInfoById,
  fetchUserCommentList,
  fetchUserReviewList,
  fetchUserLikedList,
} from "@/api/user";
import { CommentInfo, UserInfo } from "@/shared/types/interface";
import Reviews from "@/widgets/Reviews";
import CommentBox from "@/features/interaction/CommentBox";
import UserSetting from "@/features/setting/UserSetting";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ProfileInfo from "@/features/user/ProfileInfo";
import UserAvatar from "@/features/user/UserAvatar";

export default function Profile() {
  const location = useLocation();
  const loginedUserInfo = useSelector((state: RootState) => state.userInfo);

  // 사용자 정보 가져오기
  const { id: userId } = useParams();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", Number(userId)],
    queryFn: () => fetchUserInfoById(Number(userId)),
  });

  // 사용자가 작성한 댓글 가져오기
  const { data: userCommentList } = useQuery<CommentInfo[]>({
    queryKey: ["userCommentList", Number(userId)],
    queryFn: () => fetchUserCommentList(Number(userId)),
  });

  // 사용자가 작성한 리뷰 가져오기
  const { data: userReviewList } = useQuery<string[]>({
    queryKey: ["userReviewList", Number(userId)],
    queryFn: () => fetchUserReviewList(Number(userId)),
  });

  // 사용자가 추천한 리뷰 가져오기
  const { data: userLikedList } = useQuery<string[]>({
    queryKey: ["userLikedList", Number(userId)],
    queryFn: () => fetchUserLikedList(Number(userId)),
  });

  return (
    <PageTemplate pageName="프로필">
      <Card className="relative p-4 md:p-6 md:px-16 md:max-w-xl mx-auto">
        <div className="flex flex-row items-center md:items-start gap-4 md:gap-6">
          <UserAvatar
            className="h-24 w-24 md:h-32 md:w-32 my-auto"
            profileImage={userInfo?.profileImage}
            nickname={userInfo?.nickname}
          />
          <ProfileInfo userId={Number(userId)} />
        </div>
        {loginedUserInfo?.kakaoId === Number(userId) && (
          <div className="absolute right-4 top-4 md:right-6 md:top-6">
            <UserSetting />
          </div>
        )}
      </Card>

      <Tabs
        defaultValue="posts"
        value={
          !location.pathname.split("/")[3]
            ? "posts"
            : location.pathname.split("/")[3]
        }
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-3 md:max-w-xl mx-auto">
          <Link to="posts">
            <TabsTrigger className="w-full" value="posts">
              <Grid className="h-4 w-4 mr-2" /> 리뷰
            </TabsTrigger>
          </Link>
          <Link to="comments">
            <TabsTrigger className="w-full" value="comments">
              <MessageCircle className="h-4 w-4 mr-2" /> 댓글
            </TabsTrigger>
          </Link>
          <Link to="liked">
            <TabsTrigger className="w-full" value="liked">
              <Heart className="text-red-500 fill-red-500 h-4 w-4 mr-2" /> 추천
            </TabsTrigger>
          </Link>
        </TabsList>

        <Routes>
          <Route
            path=""
            element={
              <TabsContent value="posts" className="mt-6">
                {userReviewList && <Reviews reviewIdList={userReviewList} />}
              </TabsContent>
            }
          />
          <Route
            path="posts"
            element={
              <TabsContent value="posts" className="mt-6">
                {userReviewList && <Reviews reviewIdList={userReviewList} />}
              </TabsContent>
            }
          />
          <Route
            path="comments"
            element={
              <TabsContent value="comments" className="mt-6 max-w-3xl mx-auto">
                {userCommentList &&
                  userCommentList.map((commentInfo, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-1">
                      <CommentBox key={index} commentInfo={commentInfo} />
                    </div>
                  ))}
              </TabsContent>
            }
          />
          <Route
            path="liked"
            element={
              <TabsContent value="liked" className="mt-6">
                {userLikedList && <Reviews reviewIdList={userLikedList} />}
              </TabsContent>
            }
          />
        </Routes>
      </Tabs>
    </PageTemplate>
  );
}
