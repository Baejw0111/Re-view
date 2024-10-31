import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions<T> {
  callback: () => void;
  list?: T[];
  threshold?: number;
  inView?: boolean;
}

/**
 * 지정된 요소가 뷰포트에 들어올 때 콜백 함수를 호출하는 훅
 * @param callback - 요소가 뷰포트에 들어올 때 호출될 콜백 함수
 * @param list - 관찰할 요소가 속한 목록. 목록이 갱신될 때 관찰할 요소도 바뀐다.
 * @param threshold - 콜백 실행을 트리거할 요소의 가시성 비율
 * @returns 관찰될 요소에 대한 ref
 */
export default function useIntersectionObserver<T>({
  callback,
  list,
  threshold = 0.1,
}: UseIntersectionObserverOptions<T>) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      { threshold }
    );

    const observingElement = elementRef.current;

    if (observingElement) {
      observer.observe(observingElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [list]);

  return elementRef;
}
