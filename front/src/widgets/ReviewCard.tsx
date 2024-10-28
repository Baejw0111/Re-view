import UserAvatar from "@/features/user/UserAvatar";
import { ChevronRight } from "lucide-react";
import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/shadcn-ui/resizable";
import { Link } from "react-router-dom";
import { API_URL } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { fetchUserInfoById } from "@/api/user";
import { Separator } from "@/shared/shadcn-ui/separator";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import { Badge } from "@/shared/shadcn-ui/badge";
import LikeButton from "@/features/interaction/LikeButton";
import ProfilePopOver from "./ProfilePopOver";
import SkeletonReviewCard from "@/shared/skeleton/SkeletonReviewCard";
import CommentButton from "@/features/interaction/CommentButton";

export default function ReviewCard({ reviewId }: { reviewId: string }) {
  const { data: reviewInfo, isFetching: isReviewInfoFetching } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId),
    enabled: !!reviewId,
  });

  const { data: author, isFetching: isAuthorFetching } = useQuery({
    queryKey: ["userInfo", reviewInfo?.authorId],
    queryFn: () => fetchUserInfoById(reviewInfo?.authorId as number),
    enabled: !!reviewInfo,
  });

  if (isReviewInfoFetching || isAuthorFetching) return <SkeletonReviewCard />;

  return (
    <>
      {reviewInfo && (
        <Card
          className="overflow-hidden shadow-lg transition-shadow h-60 relative hover:shadow-xl active:shadow-xl"
          aria-label={`리뷰: ${reviewInfo.title}`}
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={55} collapsible={true}>
              <div className="p-4 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {author && (
                      <ProfilePopOver
                        userId={author.userInfo.kakaoId as number}
                      >
                        <div role="button" className="flex items-center gap-2">
                          <UserAvatar
                            className="h-6 w-6"
                            profileImage={author.userInfo.profileImage}
                            nickname={author.userInfo.nickname}
                          />
                          <div className="text-sm line-clamp-1 text-muted-foreground font-semibold">
                            {author.userInfo.nickname}
                          </div>
                        </div>
                      </ProfilePopOver>
                    )}
                    <ReviewRatingSign rating={reviewInfo.rating as number} />
                  </div>
                  <div className="flex items-center justify-start">
                    <Link
                      to={`?reviewId=${reviewInfo._id}`}
                      className="group flex items-center gap-1 cursor-pointer hover:text-blue-500 active:text-blue-500 transition-colors"
                    >
                      <h2 className="font-semibold line-clamp-1">
                        {reviewInfo.title}
                      </h2>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <p className="text-sm text-left text-muted-foreground line-clamp-3 whitespace-pre-wrap break-all">
                    {reviewInfo.reviewText}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex gap-1.5 w-full overflow-x-auto scrollbar-hide">
                    {reviewInfo.tags.map((tag, index) => (
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
                    <LikeButton reviewId={reviewInfo._id} className="w-5 h-5" />
                    <CommentButton reviewId={reviewInfo._id} />
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <img
                src={`${API_URL}/${reviewInfo.images[0]}`}
                alt="Review Thumbnail Image"
                className="w-full h-full object-cover"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </Card>
      )}
    </>
  );
}
