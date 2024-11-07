import { Separator } from "@/shared/shadcn-ui/separator";
import { Badge } from "@/shared/shadcn-ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById } from "@/api/user";

export default function ProfileInfo({ userId }: { userId: number }) {
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfoById(userId),
  });

  return (
    <>
      {userInfo && (
        <div className="flex-1 flex flex-col gap-6 items-center">
          <div className="flex flex-row md:items-center justify-start gap-2 md:gap-4 text-center">
            <h1 className="text-2xl font-bold">{userInfo.nickname}</h1>
          </div>
          <div className="flex justify-center md:justify-start gap-6">
            <div className="text-center">
              <p className="text-xl font-semibold">{userInfo.reviewCount}</p>
              <p className="text-xs text-muted-foreground">리뷰</p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-center">
              <p className="text-xl font-semibold">{userInfo.commentCount}</p>
              <p className="text-xs text-muted-foreground">댓글</p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-center">
              <p className="text-xl font-semibold">
                {userInfo.likedReviewCount}
              </p>
              <p className="text-xs text-muted-foreground">추천</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {userInfo.favoriteTags.length === 0 ? (
              <Badge>선호 태그가 없습니다.</Badge>
            ) : (
              userInfo.favoriteTags.map((tag) => <Badge key={tag}>{tag}</Badge>)
            )}
          </div>
        </div>
      )}
    </>
  );
}
