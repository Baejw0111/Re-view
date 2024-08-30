import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setIsOpen } from "@/state/store/reviewDetailOpenSlice";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/shadcn-ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/shared/shadcn-ui/drawer";
import { useNavigate } from "react-router-dom";
import { fetchReviewById } from "@/api/review";
import { useParams } from "react-router-dom";
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
import { useQuery } from "@tanstack/react-query";

function ReviewDetail() {
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

export default function ReviewDetailModal() {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md(768px) 아래의 너비는 모바일 환경으로 간주
  const isOpen = useSelector(
    (state: RootState) => state.reviewDetailOpen.isOpen
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const handleClose = () => {
    dispatch(setIsOpen(false));
    setTimeout(() => {
      navigate("/feed");
    }, 100);
  };

  if (isDesktop === null) return;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="block md:max-w-[760px] lg:max-w-[860px] h-[90vh] p-10 overflow-y-auto scrollbar-hide">
          <DialogTitle hidden></DialogTitle>
          <DialogDescription hidden></DialogDescription>
          <ReviewDetail />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="h-[100vh]">
        <DrawerTitle hidden></DrawerTitle>
        <DrawerDescription hidden></DrawerDescription>
        <div className="py-10 px-10 overflow-y-auto scrollbar-hide">
          <ReviewDetail />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
