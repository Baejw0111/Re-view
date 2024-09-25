import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setIsOpen } from "@/state/store/reviewDetailOpenSlice";
import { fetchReviewIdList } from "@/api/review";
import ReviewCard from "@/widgets/ReviewCard";

export default function Reviews() {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviewIdList"],
    queryFn: () => fetchReviewIdList(),
  });

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("reviewId") === null) {
      dispatch(setIsOpen(false));
    }
  }, [location.search, dispatch]);

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews?.map((reviewId: string, index: number) => (
        <ReviewCard key={index} reviewId={reviewId} />
      ))}
    </div>
  );
}
