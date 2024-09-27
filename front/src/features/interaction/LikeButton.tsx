import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useMutation } from "@tanstack/react-query";
import { likeReview, unlikeReview } from "@/api/interaction";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ReviewInfo } from "@/shared/types/interface";
import { cn } from "@/shared/lib/utils";

export default function LikeButton({
  reviewId,
  className,
}: {
  reviewId: string;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);

  const { data: reviewInfo } = useQuery<ReviewInfo, Error>({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string, kakaoId),
  });

  const { mutate: like } = useMutation({
    mutationFn: () => likeReview(reviewId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewInfo", reviewId] });
    },
    onError: () => {
      alert("추천 실패");
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: () => unlikeReview(reviewId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewInfo", reviewId] });
    },
    onError: () => {
      alert("추천 취소 실패");
    },
  });

  const [likeState, setLikeState] = useState(false);
  const likeControls = useAnimation();
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  const countControls = useAnimation();

  const handleLikeClick = async () => {
    setCurrentLikesCount(currentLikesCount + (likeState ? -1 : 1));

    await Promise.all([
      likeControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      }),
      countControls.start(
        likeState
          ? {
              opacity: [0, 1],
              y: [10, 0],
              transition: { duration: 0.3 },
            }
          : {
              opacity: [0, 1],
              y: [-10, 0],
              transition: { duration: 0.3 },
            }
      ),
    ]);

    if (likeState) {
      unlike();
    } else {
      like();
    }

    setLikeState(!likeState);
  };

  // 좋아요 상태 업데이트
  useEffect(() => {
    setCurrentLikesCount(reviewInfo?.likesCount || 0); // 추천수 업데이트
    setLikeState(reviewInfo?.isLikedByUser || false); // 로그인한 유저가 추천했는지 여부 업데이트
  }, [reviewInfo?.likesCount, reviewInfo?.isLikedByUser]);

  return (
    <div className="flex items-center gap-1.5">
      <TooltipWrapper tooltipText="추천">
        <motion.div animate={likeControls}>
          <button onClick={handleLikeClick} className="flex items-center">
            {likeState ? (
              <Heart
                className={cn(
                  "w-6 h-6 text-[#FE0000] cursor-pointer",
                  className
                )}
                fill="red"
              />
            ) : (
              <Heart
                className={cn(
                  "w-6 h-6 hover:text-[#FE0000] cursor-pointer",
                  className
                )}
              />
            )}
            <span className="sr-only">추천</span>
          </button>
        </motion.div>
      </TooltipWrapper>
      <motion.div animate={countControls}>
        <div className="text-sm text-muted-foreground">{currentLikesCount}</div>
      </motion.div>
    </div>
  );
}
