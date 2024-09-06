import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { ReviewInfo } from "@/shared/types/interface";
import { API_URL } from "@/shared/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
} from "@/shared/shadcn-ui/carousel";
import { Card, CardContent } from "@/shared/shadcn-ui/card";
import ReviewActionBar from "@/widgets/ReviewActionBar";

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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {/* <div className="font-medium">{reviewDetail.author}</div> */}
                <div className="text-md text-gray-500 dark:text-gray-400">
                  {reviewDetail.author}
                </div>
              </div>
              <div className="flex items-center justify-center bg-primary h-8 w-10 rounded-md text-primary-foreground font-bold text-xl">
                {reviewDetail.rating}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-3xl font-bold">
                {reviewDetail.title}
              </div>
            </div>
            <p className="text-sm text-left text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-all">
              {reviewDetail.reviewText}
            </p>
          </div>
          <div className="grid gap-4">
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
            <ReviewActionBar />
          </div>
        </div>
      )}
    </>
  );
}
