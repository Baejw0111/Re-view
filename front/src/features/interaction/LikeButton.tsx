import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useMutation } from "@tanstack/react-query";
import { likeReview, unlikeReview, fetchLikeStatus } from "@/api/like";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { cn } from "@/shared/lib/utils";
import { useCountingAnimation } from "@/shared/hooks";
import { useIntersectionObserver } from "@/shared/hooks";
import { toast } from "sonner";

export default function LikeButton({
  reviewId,
  className,
}: {
  reviewId: string;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);

  // 추천 상태 조회
  const { data: likeStatus, refetch } = useQuery<
    { isLiked: boolean; likesCount: number },
    Error
  >({
    queryKey: ["likeStatus", reviewId],
    queryFn: () => fetchLikeStatus(reviewId as string, kakaoId),
    enabled: !!kakaoId,
  });

  const likeButtonRef = useIntersectionObserver({
    callback: refetch,
    threshold: 1,
  });

  // 추천 추가
  const { mutate: like } = useMutation({
    mutationFn: () => likeReview(reviewId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likeStatus", reviewId] });
    },
  });

  // 추천 취소
  const { mutate: unlike } = useMutation({
    mutationFn: () => unlikeReview(reviewId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likeStatus", reviewId] });
    },
  });

  const [likeState, setLikeState] = useState(false);
  const likeControls = useAnimation();
  const [currentLikesCount, setCurrentLikesCount, countControls] =
    useCountingAnimation(0); // 추천 수 애니메이션

  const handleLikeClick = async () => {
    if (kakaoId === 0) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    setCurrentLikesCount(currentLikesCount + (likeState ? -1 : 1));

    if (likeState) {
      unlike();
    } else {
      like();
    }

    setLikeState(!likeState);
  };

  // 추천 상태 업데이트
  useEffect(() => {
    if (likeStatus) {
      if (likeStatus.isLiked !== likeState) {
        setLikeState(likeStatus.isLiked); // 로그인한 유저의 리뷰 추천 여부 업데이트
      }
      setCurrentLikesCount(likeStatus.likesCount); // 추천 수 업데이트
    }
  }, [likeStatus]);

  // 추천 애니메이션
  useEffect(() => {
    if (likeState) {
      likeControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      });
    }
  }, [likeState]);

  return (
    <div className="flex items-center gap-1.5" ref={likeButtonRef}>
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
                  "w-6 h-6 hover:text-[#FE0000] active:text-[#FE0000] cursor-pointer",
                  className
                )}
              />
            )}
            <span className="sr-only">추천</span>
          </button>
        </motion.div>
      </TooltipWrapper>
      <motion.div
        animate={countControls}
        className="text-sm text-muted-foreground"
      >
        {currentLikesCount}
      </motion.div>
    </div>
  );
}
