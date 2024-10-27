import ReviewCard from "@/widgets/ReviewCard";
import { ReviewInfo } from "@/shared/types/interface";
import { useIntersectionObserver } from "@/shared/hooks";

/**
 * @description 리뷰 카드 목록을 반환하는 컴포넌트
 * @param reviewIdList 리뷰 ID 리스트
 * @returns 리뷰 카드 목록
 */
export default function Reviews({
  reviewList,
  callback,
}: {
  reviewList: ReviewInfo[];
  callback: () => void;
}) {
  const reviewListRef = useIntersectionObserver<ReviewInfo>(
    reviewList,
    callback
  );

  return (
    <>
      {reviewList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {reviewList.map((review, index) => (
            <div
              key={review._id}
              ref={index === reviewList.length - 5 ? reviewListRef : null}
            >
              <ReviewCard reviewInfo={review} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
