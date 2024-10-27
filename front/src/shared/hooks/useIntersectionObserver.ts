import { useEffect, useRef } from "react";

export default function useIntersectionObserver<T>(
  list: T[],
  callback: () => void,
  threshold: number = 0.1
) {
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
