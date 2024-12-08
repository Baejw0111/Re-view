import PageTemplate from "../shared/original-ui/PageTemplate";
import ReviewForm from "@/widgets/ReviewForm";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";

export default function EditReview() {
  const [queryParams] = useSearchParams();
  const reviewId = queryParams.get("reviewId");

  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string),
    enabled: !!reviewId,
  });

  return (
    <PageTemplate>
      <ReviewForm reviewInfo={reviewInfo} />
    </PageTemplate>
  );
}
