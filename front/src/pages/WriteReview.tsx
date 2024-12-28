import { useEffect } from "react";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import ReviewForm from "@/widgets/ReviewForm";
import { useBlocker } from "react-router-dom";

export default function WriteReview() {
  const blocker = useBlocker(true);

  // 라우트 간 이동 시 경고창 생성
  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(
        "작성 중인 내용이 저장되지 않을 수 있습니다. 정말 나가시겠습니까?"
      );

      if (confirmLeave) {
        blocker.proceed(); // 페이지 이동을 허용
      } else {
        blocker.reset(); // 차단 상태 유지
      }
    }
  }, [blocker]);

  // 새로고침 또는 사이트를 떠나려 할 때 경고창 생성
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <PageTemplate>
      <ReviewForm />
    </PageTemplate>
  );
}
