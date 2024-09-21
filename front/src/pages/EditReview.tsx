import PageTemplate from "../shared/original-ui/PageTemplate";
import ReviewForm from "@/features/review/ReviewForm";

export default function EditReview() {
  return (
    <PageTemplate pageName="리뷰 수정">
      <ReviewForm />
    </PageTemplate>
  );
}
