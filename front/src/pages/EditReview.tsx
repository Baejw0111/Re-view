import PageTemplate from "../shared/original-ui/PageTemplate";
import ReviewForm from "@/widgets/ReviewForm";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";

export default function EditReview() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);

  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string, kakaoId),
    enabled: !!reviewId,
  });

  return (
    <PageTemplate pageName="리뷰 수정">
      <ReviewForm reviewInfo={reviewInfo} />
    </PageTemplate>
  );
}
