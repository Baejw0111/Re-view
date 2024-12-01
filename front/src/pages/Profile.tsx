import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Tabs, TabsList, TabsTrigger } from "@/shared/shadcn-ui/tabs";
import { Grid, MessageCircle, Heart } from "lucide-react";
import { Link, useParams, useLocation, Outlet } from "react-router-dom";
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

  return (
    <PageTemplate pageName="프로필">
      <Card className="flex justify-center p-8 max-w-xl mx-auto relative">
        <ProfileInfo userId={Number(userId)} tags profileImageSize="lg" />
        {loginedUserInfo.kakaoId === Number(userId) && (
          <div className="absolute right-1 top-1 md:right-4 md:top-4">
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
            <Link to="posts">
              <Grid className="h-4 w-4 mr-2" /> 리뷰
            </Link>
          </TabsTrigger>
          <TabsTrigger className="w-full" value="comments" asChild>
            <Link to="comments">
              <MessageCircle className="h-4 w-4 mr-2" /> 댓글
            </Link>
          </TabsTrigger>
          <TabsTrigger className="w-full" value="liked" asChild>
            <Link to="liked">
              <Heart className="text-red-500 fill-red-500 h-4 w-4 mr-2" /> 추천
            </Link>
          </TabsTrigger>
        </TabsList>
        <Outlet />
      </Tabs>
    </PageTemplate>
  );
}
