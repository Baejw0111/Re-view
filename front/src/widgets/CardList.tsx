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
  idList: string[];
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
    count: Math.ceil(idList.length / gridColumnCount[breakpoint]), // 가상화 리스트 목록의 행 개수
    estimateSize: cardType === "review" ? () => 240 : () => 192, // 각 행의 예상 높이
    gap: 24, // 행 간의 간격
    overscan: 2, // 미리 렌더링할 행 개수
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
                  // 가상화 윈도우 내의 각 행들을 제대로 위치시키는 설정
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                  key={item.index}
                  ref={
                    // 마지막 페이지의 뒤에서 두번째 행이 뷰포트에 보이면 무한 스크롤 콜백 함수 트리거
                    item.index ===
                    Math.ceil(idList.length / gridColumnCount[breakpoint]) - 2
                      ? infiniteScrollRef
                      : null
                  }
                >
                  {Array.from({ length: gridColumnCount[breakpoint] }).map(
                    (_, index) => {
                      // 각 카드의 Index
                      const cardIndex =
                        item.index * gridColumnCount[breakpoint] + index;

                      // 각 행에 카드들을 순서대로 배치
                      if (cardIndex < idList.length) {
                        // 카드 리스트의 카드 타입에 따라 리뷰 카드 또는 유저 프로필 카드 반환
                        return cardType === "review" ? (
                          <Suspense
                            key={index}
                            fallback={<SkeletonReviewCard />}
                          >
                            <ReviewCard
                              key={idList[cardIndex]}
                              reviewId={idList[cardIndex]}
                            />
                          </Suspense>
                        ) : (
                          <Suspense key={index} fallback={<SkeletonUserCard />}>
                            <UserCard
                              userId={idList[cardIndex]}
                              key={idList[cardIndex]}
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
              ? "리뷰가 없습니다."
              : "해당하는 유저가 없습니다."}
          </p>
        </div>
      )}
    </>
  );
}
