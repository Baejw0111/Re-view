import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions<T> {
  callback: () => void;
  dependency?: T[];
  threshold?: number;
}

/**
 * 지정된 요소가 뷰포트에 들어올 때 콜백 함수를 호출하는 훅
 * @param callback - 요소가 뷰포트에 들어올 때 호출될 콜백 함수
 * @param dependency - 관찰할 요소가 속한 목록. 목록이 갱신될 때 관찰할 요소도 바뀐다.
 * @param threshold - 콜백 실행을 트리거할 요소의 가시성 비율
 * @returns 관찰될 요소에 대한 ref
 */
export default function useIntersectionObserver<T>({
  callback,
  dependency,
  threshold = 0.1,
}: UseIntersectionObserverOptions<T>) {
  const elementRef = useRef<HTMLDivElement | null>(null); // 관찰할 요소의 DOM 요소를 감시하기 위해 직접 접근해야 하므로 ref를 사용한다.

  useEffect(() => {
    const observer = new IntersectionObserver(
      // entries는 관찰 대상 요소의 배열. 이 훅은 하나의 관찰 대상만 관찰하므로 배열의 길이는 항상 1이다.
      (entries) => {
        entries.forEach((entry) => {
          // 관찰 대상이 뷰포트에 들어오면 콜백 함수를 호출한다.
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      { threshold }
    );

    const observingElement = elementRef.current; // 관찰할 요소의 DOM

    // 관찰할 요소의 DOM이 존재하면 관찰한다.
    if (observingElement) {
      observer.observe(observingElement);
    }

    // 컴포넌트가 언마운트되면 관찰을 중단한다.
    return () => {
      observer.disconnect();
    };
  }, [dependency, callback, threshold]);

  return elementRef; // 관찰할 요소에 대한 ref를 반환한다.
}
