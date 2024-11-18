import { useNavigate } from "react-router-dom";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import ReviewForm from "@/widgets/ReviewForm";
import { useAuth } from "@/shared/hooks";

export default function WriteReview() {
  const navigate = useNavigate();
  const { isError } = useAuth();

  if (isError) {
    alert("로그인해주세요.");
    navigate("/");
  }

  return (
    <PageTemplate pageName="리뷰 작성">
      <ReviewForm />
    </PageTemplate>
  );
}
