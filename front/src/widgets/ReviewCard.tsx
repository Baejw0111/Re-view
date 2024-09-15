import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { MessageCircle, ChevronRight } from "lucide-react";
import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/shadcn-ui/resizable";
import { Link } from "react-router-dom";
import { API_URL } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById } from "@/api/interaction";
import { Separator } from "@/shared/shadcn-ui/separator";
import { fetchReviewById } from "@/api/review";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import { Badge } from "@/shared/shadcn-ui/badge";
import LikeButton from "@/features/interaction/LikeButton";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function ReviewCard({ reviewId }: { reviewId: string }) {
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);
  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId, kakaoId),
  });

  const { data: author } = useQuery({
    queryKey: ["user", reviewInfo?.authorId],
    queryFn: () => fetchUserInfoById(reviewInfo?.authorId as number),
    enabled: !!reviewInfo,
  });

  return (
    <Card
      className="overflow-hidden shadow-lg transition-shadow h-60 relative hover:shadow-xl"
      aria-label={`리뷰: ${reviewInfo?.title}`}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={55} minSize={30} collapsible={true}>
          <div className="p-4 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={author?.thumbnailImage}
                      alt={author?.nickname}
                    />
                    <AvatarFallback>
                      {author?.nickname.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs line-clamp-1 text-gray-500 dark:text-gray-400">
                    {author?.nickname}
                  </div>
                </div>
                <ReviewRatingSign rating={reviewInfo?.rating as number} />
              </div>
              <div className="flex items-center justify-start">
                <Link
                  to={`review/${reviewInfo?._id}`}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                >
                  <div className="text-md text-left font-semibold line-clamp-1">
                    {reviewInfo?.title}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap break-all">
                {reviewInfo?.reviewText}
                {/* {`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`} */}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex gap-1.5 w-full overflow-x-auto scrollbar-hide">
                {reviewInfo?.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="whitespace-nowrap cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex gap-2">
                <LikeButton reviewId={reviewId} className="w-5 h-5" />
                <TooltipWrapper tooltipText="댓글 보기">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`review/${reviewInfo?._id}`}
                      className="hover:text-muted-foreground"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Link>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {reviewInfo?.commentsCount}
                    </span>
                  </div>
                </TooltipWrapper>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <img
            src={`${API_URL}/${reviewInfo?.images[0]}`}
            alt="Review Thumbnail Image"
            className="w-full h-full object-cover"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
