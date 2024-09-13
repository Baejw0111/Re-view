import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/shadcn-ui/resizable";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById } from "@/api/interaction";
import { Separator } from "@/shared/shadcn-ui/separator";
import { fetchReviewById } from "@/api/review";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function ReviewCard({ reviewId }: { reviewId: string }) {
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);
  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId, kakaoId),
  });
  const navigate = useNavigate();

  const { data: author } = useQuery({
    queryKey: ["user", reviewInfo?.authorId],
    queryFn: () => fetchUserInfoById(reviewInfo?.authorId as number),
    enabled: !!reviewInfo,
  });

  return (
    <Card
      className="overflow-hidden shadow-lg transition-shadow h-60 relative
      hover:shadow-xl hover:cursor-pointer hover:bg-primary-foreground/90"
      onClick={() => navigate(`review/${reviewInfo?._id}`)}
      role="button"
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {author?.nickname}
                  </div>
                </div>
                <div className="flex items-center justify-center bg-primary h-6 w-8 rounded-md text-primary-foreground font-bold text-md">
                  {reviewInfo?.rating}
                </div>
              </div>
              <div className="text-md text-left font-semibold line-clamp-1">
                {reviewInfo?.title}
              </div>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap break-all">
                {reviewInfo?.reviewText}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <Separator className="my-3" />
              <div className="flex gap-1.5">
                {reviewInfo?.isLikedByUser ? (
                  <Heart className="w-5 h-5 text-red-500" fill="red" />
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {reviewInfo?.likesCount}
                </span>
                <MessageCircle className="w-5 h-5 " />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {reviewInfo?.commentsCount}
                </span>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle onClick={(event) => event.stopPropagation()} />
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
