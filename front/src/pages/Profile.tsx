import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Button } from "@/shared/shadcn-ui/button";
import { Card } from "@/shared/shadcn-ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/shadcn-ui/tabs";
import { Badge } from "@/shared/shadcn-ui/badge";
import { Grid, MessageCircle, Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById, fetchUserComments } from "@/api/interaction";
import { UserInfo, CommentInfo } from "@/shared/types/interface";
import Reviews from "@/widgets/Reviews";
import CommentBox from "@/features/interaction/CommentBox";
import UserProfile from "@/features/user/UserProfile";

export default function Profile() {
  // 사용자 정보 가져오기
  const { id: userId } = useParams();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfoById(Number(userId)),
  });

  // 사용자가 작성한 댓글 가져오기
  const { data: userComments } = useQuery<CommentInfo[]>({
    queryKey: ["userComments", userId],
    queryFn: () => fetchUserComments(Number(userId)),
  });

  return (
    <PageTemplate pageName="프로필">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <UserProfile
            className="h-24 w-24 md:h-32 md:w-32"
            thumbnailImage={userInfo?.thumbnailImage}
            nickname={userInfo?.nickname}
          />
          <div className="flex-1 text-center md:text-left flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">{userInfo?.nickname}</h1>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  프로필 편집
                </Button>
              </div>
            </div>
            <p className="text-sm">
              게시물 <strong>52</strong>
            </p>
            <div className="mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                선호 태그:
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {userInfo?.favoriteTags.length === 0 ? (
                <Badge>선호 태그가 없습니다.</Badge>
              ) : (
                userInfo?.favoriteTags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">
            <Grid className="h-4 w-4 mr-2" /> 리뷰
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageCircle className="h-4 w-4 mr-2" /> 댓글
          </TabsTrigger>
          <TabsTrigger value="likes">
            <Heart className="h-4 w-4 mr-2" /> 추천한 리뷰
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {userInfo?.reviews && <Reviews reviewIdList={userInfo?.reviews} />}
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          {userComments &&
            userComments.map((comment) => (
              <CommentBox key={comment._id} commentInfo={comment} />
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
