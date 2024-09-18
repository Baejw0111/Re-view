import { cn } from "@/shared/lib/utils";

export default function ReviewRatingSign({
  className,
  rating = 0,
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

  const colorClasses: { [key: number]: string } = {
    0: "bg-[#800000] text-white",
    0.5: "bg-[#a52a2a] text-white",
    1: "bg-[#ff0000] text-white",
    1.5: "bg-[#ff7f50] text-white",
    2: "bg-[#ff8c00] text-white",
    2.5: "bg-[#febd3d] text-black",
    3: "bg-[#ffd700] text-black",
    3.5: "bg-[#adff2f] text-black",
    4: "bg-[#04cc7b] text-black",
    4.5: "bg-[#7fffd4] text-black",
    5: "bg-[#00bfff] text-black",
  };

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center h-6 w-8 rounded-sm font-bold text-md",
        colorClasses[rating],
        className
      )}
    >
      {rating}
    </div>
  );
}
