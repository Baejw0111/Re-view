import PageTemplate from "../shared/original-ui/PageTemplate";
import ReviewForm from "@/widgets/ReviewForm";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";

export default function EditReview() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");

  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string),
    enabled: !!reviewId,
  });

  return (
    <PageTemplate pageName="리뷰 수정">
      <ReviewForm reviewInfo={reviewInfo} />
    </PageTemplate>
  );
}
