import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { ReviewInfo } from "@/shared/types/interface";
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
import { fetchReviewLikesCount, fetchUserInfoById } from "@/api/interaction";
import { Separator } from "@/shared/shadcn-ui/separator";

export default function ReviewCard({ reviewData }: { reviewData: ReviewInfo }) {
  const { _id, authorId, title, reviewText, images, commentsCount } =
    reviewData;
  const navigate = useNavigate();

  const { data: likesCount } = useQuery({
    queryKey: ["likesCount", _id],
    queryFn: () => fetchReviewLikesCount(_id),
  });

  const { data: author } = useQuery({
    queryKey: ["user", authorId],
    queryFn: () => fetchUserInfoById(authorId),
  });

  return (
    <Card
      className="overflow-hidden shadow-lg transition-shadow h-60 relative
      hover:shadow-xl hover:cursor-pointer hover:bg-primary-foreground/90"
      onClick={() => navigate(`review/${_id}`)}
      role="button"
      aria-label={`리뷰: ${title}`}
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
                {title}
              </h3>
              <div className="flex items-center mb-2">
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
                <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
              </div>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap break-all">
                {reviewText}
              </p>
            </div>
            <div className="flex flex-col items-start mt-4">
              <Separator className="my-2" />
              <div className="flex">
                <Heart className="w-5 h-5 flex-shrink-0 mr-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  {likesCount}
                </span>
                <MessageCircle className="w-5 h-5 flex-shrink-0 mr-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {commentsCount}
                </span>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle onClick={(event) => event.stopPropagation()} />
        <ResizablePanel>
          <img
            src={`${API_URL}/${images[0]}`}
            alt="Review Thumbnail Image"
            className="w-full h-full object-cover"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
