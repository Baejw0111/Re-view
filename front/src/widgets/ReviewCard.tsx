import UserAvatar from "@/features/user/UserAvatar";
import { ChevronRight } from "lucide-react";
import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/shadcn-ui/resizable";
import { Link } from "react-router";
import { IMG_SRC } from "@/shared/constants";
import { Separator } from "@/shared/shadcn-ui/separator";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import LikeButton from "@/features/interaction/LikeButton";
import ProfilePopOver from "@/widgets/ProfilePopOver";
import CommentButton from "@/features/interaction/CommentButton";
import TagBadge from "@/features/review/TagBadge";
import { Button } from "@/shared/shadcn-ui/button";
import { ReviewInfo } from "@/shared/types/interface";

export default function ReviewCard({ reviewInfo }: { reviewInfo: ReviewInfo }) {
  return (
    <Card
      className="overflow-hidden shadow-lg transition-shadow h-60 relative hover:shadow-xl active:shadow-xl"
      aria-label={`리뷰: ${reviewInfo.title}`}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={55} collapsible={true}>
          <div className="p-4 flex flex-col justify-between h-full">
            {/* 리뷰 카드 상단 */}
            <div className="flex flex-col gap-2 min-h-0">
              {/*작성자 정보 및 평점 */}
              <div className="flex items-center justify-between">
                {/* 작성자 정보 및 프로필 팝오버 버튼*/}
                <ProfilePopOver userId={reviewInfo.authorId}>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-0 h-auto min-w-8"
                  >
                    <UserAvatar
                      className="h-6 w-6"
                      profileImage={reviewInfo.userProfileImage}
                      nickname={reviewInfo.userNickname}
                    />
                    <div
                      className={`text-sm text-muted-foreground font-semibold truncate ${
                        reviewInfo.userNickname === "운영자"
                          ? "text-orange-500"
                          : ""
                      }`}
                    >
                      {reviewInfo.userNickname}
                    </div>
                  </Button>
                </ProfilePopOver>

                {/* 평점 */}
                <ReviewRatingSign rating={reviewInfo.rating as number} />
              </div>

              {/* 리뷰 제목 및 상세 페이지 링크 */}
              <div className="flex items-center justify-start">
                <Link
                  to={`/review/${reviewInfo.aliasId}`}
                  className="group flex items-center gap-1 cursor-pointer hover:text-blue-500 active:text-blue-500 transition-colors"
                >
                  <h2 className="font-semibold line-clamp-1">
                    {reviewInfo.title}
                  </h2>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 리뷰 내용 */}
              <p className="text-sm text-left text-muted-foreground line-clamp-3 whitespace-pre-wrap break-all flex-1 min-h-0">
                {reviewInfo.isSpoiler
                  ? "❗❗ 스포일러 리뷰입니다 ❗❗"
                  : reviewInfo.reviewText}
              </p>
            </div>

            {/* 리뷰 카드 하단 */}
            <div className="flex flex-col items-start">
              {/* 태그 */}
              <div className="flex gap-1.5 w-full overflow-x-auto scrollbar-hide">
                {reviewInfo.tags.map((tag, index) => (
                  <TagBadge key={index} tag={tag} />
                ))}
              </div>
              <Separator className="my-3" />
              {/* 좋아요 버튼 및 댓글 버튼 */}
              <div className="flex gap-2">
                <LikeButton reviewId={reviewInfo.aliasId} className="w-5 h-5" />
                <CommentButton reviewId={reviewInfo.aliasId} />
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          {/* 리뷰 썸네일 이미지 */}
          <img
            src={`${IMG_SRC}/${reviewInfo.images[0]}`}
            alt="Review Thumbnail Image"
            className="w-full h-full object-cover"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
