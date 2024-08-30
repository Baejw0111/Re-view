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

export default function ReviewCard({ reviewData }: { reviewData: ReviewInfo }) {
  const { author, title, reviewText, images, _id } = reviewData;
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => {
        navigate(`review/${_id}`);
      }}
      className="overflow-hidden shadow-lg transition-shadow h-60 relative
      hover:shadow-xl hover:cursor-pointer hover:bg-primary-foreground/90"
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={55} minSize={30} collapsible={true}>
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center mb-2">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {author}
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
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-normal break-words">
                {reviewText}
              </p>
            </div>
            <div className="flex items-center mt-4">
              <Heart className="w-5 h-5 flex-shrink-0 mr-2" />
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
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
