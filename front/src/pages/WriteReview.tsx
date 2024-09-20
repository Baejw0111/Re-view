import ReviewForm from "@/features/review/ReviewForm";

export default function WriteReview() {
  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">리뷰 작성</h1>
        </div>
        <ReviewForm />
      </div>
    </>
  );
}
