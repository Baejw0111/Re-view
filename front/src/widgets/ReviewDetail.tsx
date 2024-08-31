import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { ReviewInfo } from "@/shared/types/interface";
import { API_URL } from "@/shared/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
} from "@/shared/shadcn-ui/carousel";
import { Card, CardContent } from "@/shared/shadcn-ui/card";

export default function ReviewDetail() {
  const { id } = useParams();
  const {
    data: reviewDetail,
    isLoading,
    error,
  } = useQuery<ReviewInfo, Error>({
    queryKey: ["reviewDetail", id],
    queryFn: () => fetchReviewById(id as string),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {reviewDetail && (
        <div className="flex flex-col">
          <div className="mb-10">
            <div className="flex items-center mb-2">
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {reviewDetail.author}
              </span>
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="text-2xl md:text-3xl font-bold">
                {reviewDetail.title}
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
              <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
              <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
              <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
              <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
            </div>
            <p className="text-sm text-left text-gray-500 dark:text-gray-400 whitespace-normal break-words">
              {reviewDetail.reviewText}
            </p>
          </div>
          <Carousel>
            <CarouselContent className="py-1">
              {reviewDetail.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-auto items-center justify-center p-0">
                      <img
                        src={`${API_URL}/${image}`}
                        alt={`review Image-${index}`}
                        className="w-full h-full object-contain rounded-xl aspect-video"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
      )}
    </>
  );
}
