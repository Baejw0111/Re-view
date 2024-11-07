import { useRef } from "react";
import ReviewCard from "@/widgets/ReviewCard";
import { useIntersectionObserver } from "@/shared/hooks";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { VirtualItem } from "@tanstack/react-virtual";
import { useTailwindBreakpoint } from "@/shared/hooks";

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
  const breakpoint = useTailwindBreakpoint(); // 현재 화면 너비
  const listRef = useRef<HTMLDivElement>(null);
  const gridColumnCount = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    "2xl": 4,
  }; // 현재 화면 너비에 따른 그리드 칼럼 수

  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(reviewIdList.length / gridColumnCount[breakpoint]),
    estimateSize: () => 240,
    gap: 24,
    overscan: 2,
  });

  const infiniteScrollRef = useIntersectionObserver<VirtualItem>({
    callback,
    dependency: virtualizer.getVirtualItems(),
  });

  return (
    <>
      {reviewIdList && (
        <div ref={listRef}>
          <div
            className="relative w-full"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((item) => (
              <div
                key={reviewIdList[item.index]}
                className="absolute top-0 left-0 w-full"
                data-index={item.index}
                ref={virtualizer.measureElement}
                style={{
                  transform: `translateY(${
                    item.start - virtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                  ref={
                    item.index ===
                    Math.ceil(
                      reviewIdList.length / gridColumnCount[breakpoint]
                    ) -
                      2
                      ? infiniteScrollRef
                      : null
                  }
                >
                  {Array.from({ length: gridColumnCount[breakpoint] }).map(
                    (_, index) => {
                      if (
                        item.index * gridColumnCount[breakpoint] + index <
                        reviewIdList.length
                      ) {
                        return (
                          <ReviewCard
                            key={
                              reviewIdList[
                                item.index * gridColumnCount[breakpoint] + index
                              ]
                            }
                            reviewId={
                              reviewIdList[
                                item.index * gridColumnCount[breakpoint] + index
                              ]
                            }
                          />
                        );
                      }
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
