import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { ReviewInfo } from "@/shared/types/interface";
import { API_URL } from "@/shared/constants";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
  CarouselApi,
} from "@/shared/shadcn-ui/carousel";
import ReviewActionBar from "@/widgets/ReviewActionBar";
import { fetchUserInfoById } from "@/api/user";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import { Badge } from "@/shared/shadcn-ui/badge";
import UserAvatar from "@/features/user/UserAvatar";
import { claculateTime } from "@/shared/lib/utils";
import { AspectRatio } from "@/shared/shadcn-ui/aspect-ratio";

export default function ReviewDetail() {
  const [queryParams] = useSearchParams();
  const reviewId = queryParams.get("reviewId");
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);

  // 캐러셀 넘버링
  // 참고: https://ui.shadcn.com/docs/components/carousel#api
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // 리뷰 정보
  const {
    data: reviewInfo,
    isLoading,
    error,
  } = useQuery<ReviewInfo, Error>({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string),
    enabled: !!reviewId,
  });

  // 유저 정보
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", reviewInfo?.authorId],
    queryFn: () => fetchUserInfoById(reviewInfo?.authorId as number),
    enabled: !!reviewInfo, // reviewInfo가 있을 때만 쿼리 실행
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {reviewInfo && (
        <div className="flex flex-col gap-6">
          {/* 리뷰 정보*/}
          <div className="flex flex-col gap-2 md:gap-4">
            {/* 리뷰 정보 상단(유저 프로필 + 평점) */}
            <div className="flex items-center justify-between">
              {/* 유저 프로필 링크 */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${reviewInfo.authorId}`}
                  className="flex items-center gap-2"
                >
                  <UserAvatar
                    className="h-7 w-7"
                    profileImage={userInfo?.profileImage}
                    nickname={userInfo?.nickname}
                  />
                  <div className="line-clamp-1 font-semibold">
                    {userInfo?.nickname}
                  </div>
                </Link>
                <div className="text-xs text-muted-foreground">
                  {claculateTime(reviewInfo.uploadTime)}
                </div>
              </div>

              {/* 평점 */}
              <ReviewRatingSign
                className="h-7 w-9 text-xl"
                rating={reviewInfo.rating}
              />
            </div>

            {/* 리뷰 제목 */}
            <h1 className="text-2xl font-bold">{reviewInfo.title}</h1>

            {/* 리뷰 내용 */}
            <p className="text-md text-muted-foreground whitespace-pre-wrap break-all">
              {reviewInfo.reviewText}
            </p>
          </div>

          {/* 리뷰 태그 */}
          <div className="flex flex-wrap items-start gap-1.5">
            {reviewInfo?.tags.map((tag, index) => (
              <Badge key={index} className="cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {/* 리뷰 이미지 */}
            <div className="flex flex-col">
              <Carousel setApi={setApi}>
                <CarouselContent className="py-1">
                  {reviewInfo.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          className="w-full h-full object-contain rounded-md bg-black border-0"
                          src={`${API_URL}/${image}`}
                          alt={`review Image-${index}`}
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
              <div className="w-12 mx-auto bg-muted text-muted-foreground text-center text-sm rounded-md">
                {current} / {count}
              </div>
            </div>

            {/* 리뷰 관련 상호작용 버튼들 */}
            <ReviewActionBar isAuthor={reviewInfo.authorId === kakaoId} />
          </div>
        </div>
      )}
    </>
  );
}
