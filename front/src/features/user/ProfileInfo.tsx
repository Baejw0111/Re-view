import { useMutation } from "@tanstack/react-query";
import { Separator } from "@/shared/shadcn-ui/separator";
import { Badge } from "@/shared/shadcn-ui/badge";
import TagBadge from "@/features/review/TagBadge";
import UserAvatar from "@/features/user/UserAvatar";
import { adminDeleteUserAccount } from "@/api/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/shared/shadcn-ui/button";
import { UserX } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { UserInfo } from "@/shared/types/interface";

export default function ProfileInfo({
  userInfo,
  tags,
  profileImageSize = "md",
}: {
  userInfo: UserInfo;
  tags?: boolean;
  profileImageSize?: "sm" | "md" | "lg";
}) {
  const loginnedUserNickname = useSelector(
    (state: RootState) => state.userInfo.nickname
  );

  const adminDeleteUserAccountMutation = useMutation({
    mutationFn: adminDeleteUserAccount,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("회원 탈퇴 과정에서 오류 발생", {
        description: error.response?.data?.message,
      });
    },
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
      {loginnedUserNickname === "운영자" && userInfo.nickname !== "운영자" && (
        <Button
          variant="destructive"
          onClick={() =>
            adminDeleteUserAccountMutation.mutate(userInfo.aliasId)
          }
          className="font-bold"
        >
          <UserX className="w-4 h-4 mr-2" />
          강제 탈퇴
        </Button>
      )}
    </div>
  );
}
