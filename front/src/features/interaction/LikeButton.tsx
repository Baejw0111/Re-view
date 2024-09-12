import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { useParams } from "react-router-dom";
import { useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/shadcn-ui/button";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useMutation } from "@tanstack/react-query";
import { likeReview, unlikeReview } from "@/api/interaction";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ReviewInfo } from "@/shared/types/interface";

export default function LikeButton() {
  const { id: reviewId } = useParams();
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

  useEffect(() => {
    setCurrentLikesCount(reviewInfo?.likesCount || 0);
    setLikeState(reviewInfo?.isLikedByUser || false);
  }, [reviewInfo?.likesCount, reviewInfo?.isLikedByUser]);

  return (
    <>
      <TooltipWrapper tooltipText="추천">
        <motion.div animate={likeControls}>
          <Button
            variant="link"
            size="icon"
            onClick={handleLikeClick}
            className="relative"
          >
            {likeState ? (
              <Heart className="w-6 h-6 text-red-500" fill="red" />
            ) : (
              <Heart className="w-6 h-6 hover:text-red-500" />
            )}
            <span className="sr-only">추천</span>
          </Button>
        </motion.div>
      </TooltipWrapper>
      <motion.div animate={countControls} hidden={currentLikesCount === 0}>
        <div className="text-sm text-muted-foreground">{currentLikesCount}</div>
      </motion.div>
    </>
  );
}
