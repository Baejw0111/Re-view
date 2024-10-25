import { useEffect, useRef } from "react";
import ReviewCard from "@/widgets/ReviewCard";
import { ReviewInfo } from "@/shared/types/interface";

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
  callback?: () => void;
}) {
  const reviewListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (callback) callback();
          }
        });
      },
      { threshold: 0.1 } // 10%가 보일 때 트리거
    );

    const observingElement = reviewListRef.current;

    if (observingElement) {
      observer.observe(observingElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [reviewList]);

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
