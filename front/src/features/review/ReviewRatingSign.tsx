import { cn } from "@/shared/lib/utils";

export default function ReviewRatingSign({
  className,
  rating,
}: {
  className?: string;
  rating: number;
}) {
  // 0	마룬	#800000
  // 0.5	갈색	#a52a2a
  // 1	빨강	#ff0000
  // 1.5	코랄	#ff7f50
  // 2	다크오렌지	#ff8c00
  // 2.5	오렌지 #febd3d
  // 3	골드	#ffd700
  // 3.5	그린 옐로우	#adff2f
  // 4	초록색	#04cc7b
  // 4.5	아쿠아마린	#7fffd4
  // 5	딥스카이블루	#00bfff

  const color: { [key: number]: string } = {
    0: "#800000",
    0.5: "#a52a2a",
    1: "#ff0000",
    1.5: "#ff7f50",
    2: "#ff8c00",
    2.5: "#febd3d",
    3: "#ffd700",
    3.5: "#adff2f",
    4: "#04cc7b",
    4.5: "#7fffd4",
    5: "#00bfff",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center h-6 w-8 rounded-sm text-primary-foreground font-bold text-md",
        className
      )}
      style={{ backgroundColor: color[rating] }}
    >
      {rating}
    </div>
  );
}
