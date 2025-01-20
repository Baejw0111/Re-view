import { Suspense } from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import ReviewDetail from "@/widgets/ReviewDetail";
import CommentList from "@/widgets/CommentList";
import CommentInput from "@/features/interaction/CommentInput";
import { Separator } from "@/shared/shadcn-ui/separator";

export default function Review() {
  const { reviewId } = useParams();

  return (
    <PageTemplate>
      <div className="max-w-xl mx-auto">
        <ReviewDetail />
        <Separator className="my-4" />
        <Suspense fallback={<div>로딩중...</div>}>
          <CommentList reviewId={reviewId as string} />
        </Suspense>
        <CommentInput />
      </div>
    </PageTemplate>
  );
}
