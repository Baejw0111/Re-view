import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { fetchCommentCount } from "@/api/comment";
import { useQuery } from "@tanstack/react-query";
import { useCountingAnimation } from "@/shared/hooks";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/shared/hooks";

export default function CommentButton({ reviewId }: { reviewId: string }) {
  const { data: commentCount, refetch } = useQuery({
    queryKey: ["commentCount", reviewId],
    queryFn: () => fetchCommentCount(reviewId),
    enabled: !!reviewId,
  });

  const commentButtonRef = useIntersectionObserver({
    callback: refetch,
    threshold: 1,
  });

  const [currentCommentCount, setCurrentCommentCount, countControls] =
    useCountingAnimation(0);

  useEffect(() => {
    if (commentCount !== null && commentCount !== undefined) {
      setCurrentCommentCount(commentCount);
    }
  }, [commentCount]);

  return (
    <div className="flex items-center gap-1.5" ref={commentButtonRef}>
      <TooltipWrapper tooltipText="댓글 보기">
        <Link
          to={`/review/${reviewId}#comment-list`}
          className="hover:text-muted-foreground active:text-muted-foreground"
        >
          <MessageCircle className="w-5 h-5" />
        </Link>
      </TooltipWrapper>
      <motion.div
        animate={countControls}
        className="text-sm text-muted-foreground"
      >
        {currentCommentCount}
      </motion.div>
    </div>
  );
}
