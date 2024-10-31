import ReviewCard from "@/widgets/ReviewCard";
import { useIntersectionObserver } from "@/shared/hooks";

/**
 * @description 리뷰 카드 목록을 반환하는 컴포넌트
 * @param reviewIdList 리뷰 ID 리스트
 * @returns 리뷰 카드 목록
 */
export default function Reviews({
  reviewIdList,
  callback,
}: {
  reviewIdList: string[];
  callback: () => void;
}) {
  const reviewListRef = useIntersectionObserver<string>({
    callback,
    list: reviewIdList,
  });

  return (
    <>
      {reviewIdList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {reviewIdList.map((reviewId, index) => (
            <div
              key={reviewId}
              ref={index === reviewIdList.length - 5 ? reviewListRef : null}
            >
              <ReviewCard reviewId={reviewId} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
