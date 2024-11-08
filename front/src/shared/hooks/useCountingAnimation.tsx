import { useState, useEffect } from "react";
import { useAnimation } from "framer-motion";

/**
 * 카운팅 애니메이션 훅
 * @param initialCount 초기 카운트 값
 * @returns 현재 카운트, 현재 카운트 설정 함수, 카운트 애니메이션 컨트롤
 */
export default function useCountingAnimation(initialCount: number) {
  const [currentCount, setCurrentCount] = useState(initialCount);
  const [previousCount, setPreviousCount] = useState(initialCount);
  const countControls = useAnimation();

  useEffect(() => {
    countControls.start(
      currentCount > previousCount
        ? {
            opacity: [0, 1],
            y: [10, 0],
            transition: { duration: 0.3 },
          }
        : currentCount < previousCount
        ? {
            opacity: [0, 1],
            y: [-10, 0],
            transition: { duration: 0.3 },
          }
        : {}
    );

    setPreviousCount(currentCount);
  }, [currentCount]);

  return [currentCount, setCurrentCount, countControls] as const;
}
