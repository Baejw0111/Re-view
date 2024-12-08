import { Suspense, useRef } from "react";
import ReviewCard from "@/widgets/ReviewCard";
import { useIntersectionObserver } from "@/shared/hooks";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { VirtualItem } from "@tanstack/react-virtual";
import { useTailwindBreakpoint } from "@/shared/hooks";
import UserCard from "@/widgets/UserCard";
import SkeletonReviewCard from "@/shared/skeleton/SkeletonReviewCard";
import SkeletonUserCard from "@/shared/skeleton/SkeletonUserCard";

/**
 * @description 카드 목록을 반환하는 컴포넌트
 * @param idList 카드 ID 리스트
 * @param callback 무한 스크롤 콜백 함수
 * @param cardType 카드 타입(리뷰 카드 또는 유저 프로필 카드)
 * @returns 카드 목록
 */
export default function CardList({
  idList,
  callback,
  cardType,
}: {
  idList: string[] | number[];
  callback: () => void;
  cardType: "review" | "userProfile";
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
    count: Math.ceil(idList.length / gridColumnCount[breakpoint]),
    estimateSize: cardType === "review" ? () => 240 : () => 192,
    gap: 24,
    overscan: 2,
  });

  const infiniteScrollRef = useIntersectionObserver<VirtualItem>({
    callback,
    dependency: virtualizer.getVirtualItems(),
  });

  return (
    <>
      {idList.length > 0 ? (
        <div ref={listRef}>
          <div
            className="relative w-full"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((item) => (
              <div
                key={idList[item.index]}
                className="absolute top-0 left-0 w-full"
                data-index={item.index}
                style={{
                  transform: `translateY(${
                    item.start - virtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                  key={item.index}
                  ref={
                    item.index ===
                    Math.ceil(idList.length / gridColumnCount[breakpoint]) - 2
                      ? infiniteScrollRef
                      : null
                  }
                >
                  {Array.from({ length: gridColumnCount[breakpoint] }).map(
                    (_, index) => {
                      if (
                        item.index * gridColumnCount[breakpoint] + index <
                        idList.length
                      ) {
                        return cardType === "review" ? (
                          <Suspense
                            key={index}
                            fallback={<SkeletonReviewCard />}
                          >
                            <ReviewCard
                              key={
                                idList[
                                  item.index * gridColumnCount[breakpoint] +
                                    index
                                ]
                              }
                              reviewId={String(
                                idList[
                                  item.index * gridColumnCount[breakpoint] +
                                    index
                                ]
                              )}
                            />
                          </Suspense>
                        ) : (
                          <Suspense key={index} fallback={<SkeletonUserCard />}>
                            <UserCard
                              userId={Number(
                                idList[
                                  item.index * gridColumnCount[breakpoint] +
                                    index
                                ]
                              )}
                              key={
                                idList[
                                  item.index * gridColumnCount[breakpoint] +
                                    index
                                ]
                              }
                            />
                          </Suspense>
                        );
                      }
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">
            {cardType === "review"
              ? "등록된 리뷰가 없습니다."
              : "해당하는 유저가 없습니다."}
          </p>
        </div>
      )}
    </>
  );
}
