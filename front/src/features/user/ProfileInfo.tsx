import { Separator } from "@/shared/shadcn-ui/separator";
import { Badge } from "@/shared/shadcn-ui/badge";
import { useSuspenseQuery } from "@tanstack/react-query";
import TagBadge from "@/features/review/TagBadge";
import UserAvatar from "@/features/user/UserAvatar";
import { fetchUserInfoById } from "@/api/user";

export default function ProfileInfo({
  userId,
  tags,
  profileImageSize = "md",
}: {
  userId: string;
  tags?: boolean;
  profileImageSize?: "sm" | "md" | "lg";
}) {
  const { data: userInfo } = useSuspenseQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfoById(userId),
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row w-full items-center gap-6">
        <div className="flex-1 flex justify-center items-center">
          <UserAvatar
            className={`${
              profileImageSize === "sm"
                ? "h-24 w-24"
                : profileImageSize === "md"
                ? "h-32 w-32"
                : "h-36 w-36"
            } my-auto`}
            nickname={userInfo.nickname}
            profileImage={userInfo.profileImage}
          />
        </div>
        <div className="flex-1 flex flex-col gap-6 items-start">
          <div className="flex flex-row justify-start gap-2 md:gap-4 text-center">
            <h1
              className={`text-2xl font-bold ${
                userInfo.nickname === "운영자" ? "text-orange-500" : ""
              }`}
            >
              {userInfo.nickname}
            </h1>
          </div>
          <div className="flex justify-start gap-4">
            <div className="text-center flex flex-col gap-1">
              <p className="text-xl font-semibold">{userInfo.reviewCount}</p>
              <p className="text-xs text-muted-foreground">리뷰</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center flex flex-col gap-1">
              <p className="text-xl font-semibold">
                {userInfo.reviewCount === 0
                  ? 0
                  : (userInfo.totalRating / userInfo.reviewCount).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">평균 평점</p>
            </div>
          </div>
        </div>
      </div>
      {tags && (
        <div className="flex flex-wrap gap-2 justify-center">
          {userInfo.favoriteTags.length === 0 ? (
            <Badge>선호 태그가 없습니다.</Badge>
          ) : (
            userInfo.favoriteTags.map((tag) => <TagBadge key={tag} tag={tag} />)
          )}
        </div>
      )}
    </div>
  );
}
