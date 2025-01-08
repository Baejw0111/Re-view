import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useMutation } from "@tanstack/react-query";
import {
  likeReview,
  unlikeReview,
  fetchUserLiked,
  fetchLikeCount,
} from "@/api/like";
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
  const socialId = useSelector((state: RootState) => state.userInfo.socialId);

  // 추천 수 조회
  const { data: likesCount } = useQuery<number, Error>({
    queryKey: ["likesCount", reviewId],
    queryFn: () => fetchLikeCount(reviewId),
  });

  // 사용자의 리뷰 추천 여부 조회
  const { data: userLiked, refetch } = useQuery<boolean, Error>({
    queryKey: ["userLiked", reviewId],
    queryFn: () => fetchUserLiked(reviewId),
    enabled: socialId !== "",
  });

  const likeButtonRef = useIntersectionObserver({
    callback: () => {
      if (socialId !== "") {
        refetch();
      }
    },
    threshold: 1,
  });

  // 추천 추가
  const { mutate: like } = useMutation({
    mutationFn: () => likeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLiked", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["likesCount", reviewId] });
    },
  });

  // 추천 취소
  const { mutate: unlike } = useMutation({
    mutationFn: () => unlikeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLiked", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["likesCount", reviewId] });
    },
  });

  const [likeState, setLikeState] = useState(false); // 사용자의 리뷰 추천 여부
  const likeControls = useAnimation(); // 추천 애니메이션
  const [currentLikesCount, setCurrentLikesCount, countControls] =
    useCountingAnimation(0); // 추천 수 증감 애니메이션

  const handleLikeClick = async () => {
    if (socialId === "") {
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

  // 사용자의 리뷰 추천 상태 업데이트
  useEffect(() => {
    if (userLiked !== undefined) {
      if (userLiked !== likeState) {
        setLikeState(userLiked); // 로그인한 유저의 리뷰 추천 여부 업데이트
      }
    }
  }, [userLiked]);

  // 추천 수 업데이트
  useEffect(() => {
    if (likesCount !== undefined) {
      setCurrentLikesCount(likesCount);
    }
  }, [likesCount]);

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
