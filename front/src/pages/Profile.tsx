import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Card } from "@/shared/shadcn-ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/shadcn-ui/tabs";
import { Grid, MessageCircle, Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById, fetchUserComments } from "@/api/interaction";
import { UserInfo, CommentInfo } from "@/shared/types/interface";
import Reviews from "@/widgets/Reviews";
import CommentBox from "@/features/interaction/CommentBox";
import UserSetting from "@/features/setting/UserSetting";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ProfileInfo from "@/features/user/ProfileInfo";
import UserAvatar from "@/features/user/UserAvatar";

export default function Profile() {
  const loginedUserInfo = useSelector((state: RootState) => state.userInfo);

  // 사용자 정보 가져오기
  const { id: userId } = useParams();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", Number(userId)],
    queryFn: () => fetchUserInfoById(Number(userId)),
  });

  // 사용자가 작성한 댓글 가져오기
  const { data: userComments } = useQuery<CommentInfo[]>({
    queryKey: ["userComments", Number(userId)],
    queryFn: () => fetchUserComments(Number(userId)),
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

      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 md:max-w-xl mx-auto">
          <TabsTrigger value="posts">
            <Grid className="h-4 w-4 mr-2" /> 리뷰
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageCircle className="h-4 w-4 mr-2" /> 댓글
          </TabsTrigger>
          <TabsTrigger value="likes">
            <Heart className="h-4 w-4 mr-2" /> 추천
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {userInfo?.reviews && <Reviews reviewIdList={userInfo?.reviews} />}
        </TabsContent>
        <TabsContent value="comments" className="mt-6 max-w-3xl mx-auto">
          {userComments &&
            userComments.map((comment) => (
              <div key={comment._id} className="border-b last:border-b-0 pt-2">
                <CommentBox key={comment._id} commentInfo={comment} />
              </div>
            ))}
        </TabsContent>
        <TabsContent value="likes" className="mt-6">
          {userInfo?.likedReviews && (
            <Reviews reviewIdList={userInfo?.likedReviews} />
          )}
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
}
