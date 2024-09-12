import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { Star, Heart, MessageCircle } from "lucide-react";
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
            <div>
              <div className="flex items-center mb-2">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage
                    src={author?.thumbnailImage}
                    alt={author?.nickname}
                  />
                  <AvatarFallback>
                    {author?.nickname.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {author?.nickname}
                </span>
              </div>
              <h3 className="text-lg text-left font-semibold mb-2 line-clamp-1">
                {reviewInfo?.title}
              </h3>
              <div className="flex items-center mb-2">
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
              </div>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap break-all">
                {reviewInfo?.reviewText}
              </p>
            </div>
            <div className="flex flex-col items-start mt-4">
              <Separator className="my-2" />
              <div className="flex">
                {reviewInfo?.isLikedByUser ? (
                  <Heart
                    className="w-5 h-5 flex-shrink-0 mr-1 text-red-500"
                    fill="red"
                  />
                ) : (
                  <Heart className="w-5 h-5 flex-shrink-0 mr-1" />
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  {reviewInfo?.likesCount}
                </span>
                <MessageCircle className="w-5 h-5 flex-shrink-0 mr-1" />
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
