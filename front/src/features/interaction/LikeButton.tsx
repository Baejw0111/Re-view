import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewLikesCount } from "@/api/interaction";
import { useParams } from "react-router-dom";
import { useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/shadcn-ui/button";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function LikeButton() {
  const { id } = useParams();

  const { data: likesCount } = useQuery({
    queryKey: ["likesCount", id],
    queryFn: () => fetchReviewLikesCount(id as string),
  });

  const [isLiked, setIsLiked] = useState(false);
  const likeControls = useAnimation();
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  const countControls = useAnimation();

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    setCurrentLikesCount(currentLikesCount + (isLiked ? -1 : 1));

    await Promise.all([
      likeControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      }),
      countControls.start(
        isLiked
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
  };

  useEffect(() => {
    setCurrentLikesCount(likesCount || 0);
  }, [likesCount]);

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
            {isLiked ? (
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