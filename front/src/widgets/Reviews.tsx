import { useQuery } from "@tanstack/react-query";
import { fetchReviewList } from "@/util/api";
import ReviewCard from "@/features/ReviewCard";
import { Review } from "@/util/interface";

export default function Reviews() {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviewList,
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {reviews?.map((review: Review, index: number) => (
        <ReviewCard key={index} reviewData={review} />
      ))}
    </div>
  );
}
