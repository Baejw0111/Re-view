import MovingLogo from "@/features/common/MovingLogo";

export default function ContentsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <MovingLogo />
      <h2 className="text-3xl font-semibold">리뷰 가져오는 중...</h2>
    </div>
  );
}
