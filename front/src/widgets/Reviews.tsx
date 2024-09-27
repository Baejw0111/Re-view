import ReviewCard from "@/widgets/ReviewCard";

/**
 * @description 리뷰 카드 목록을 반환하는 컴포넌트
 * @param reviewIdList 리뷰 ID 리스트
 * @returns 리뷰 카드 목록
 */
export default function Reviews({ reviewIdList }: { reviewIdList: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviewIdList?.map((reviewId: string, index: number) => (
        <ReviewCard key={index} reviewId={reviewId} />
      ))}
    </div>
  );
}
