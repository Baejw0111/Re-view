import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { Share2, Trash2, FilePenLine, Siren } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteReview } from "@/api/review";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import LikeButton from "@/features/interaction/LikeButton";
import { VITE_CLIENT_URL } from "@/shared/constants";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function ReviewActionBar({ isAuthor }: { isAuthor: boolean }) {
  const [queryParams] = useSearchParams();
  const reviewId = queryParams.get("reviewId");

  const { mutate: deleteReviewMutate } = useMutation({
    mutationFn: () => deleteReview(reviewId as string),
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("리뷰 삭제 실패", {
        description: error.response?.data?.message,
      });
    },
  });

  return (
    <div className="flex items-center gap-2">
      <LikeButton reviewId={reviewId as string} />
      <TooltipWrapper tooltipText="공유">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(
              `${VITE_CLIENT_URL}/?reviewId=${reviewId}`
            );
            toast.success("링크가 복사되었습니다.");
          }}
        >
          <Share2 className="w-6 h-6" />
          <span className="sr-only">공유</span>
        </Button>
      </TooltipWrapper>
      <div className="flex items-center gap-2 ml-auto">
        {isAuthor ? (
          <>
            <TooltipWrapper tooltipText="수정">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/edit?reviewId=${reviewId}`}>
                  <FilePenLine className="w-6 h-6" />
                  <span className="sr-only">수정</span>
                </Link>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper tooltipText="삭제">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteReviewMutate()}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/20 active:bg-destructive/20 active:text-destructive"
              >
                <Trash2 className="w-6 h-6" />
                <span className="sr-only">삭제</span>
              </Button>
            </TooltipWrapper>
          </>
        ) : (
          <TooltipWrapper tooltipText="신고">
            <Button variant="ghost" size="icon">
              <Siren className="w-6 h-6" />
              <span className="sr-only">신고</span>
            </Button>
          </TooltipWrapper>
        )}
      </div>
    </div>
  );
}
