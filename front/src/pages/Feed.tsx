import Reviews from "@/components/Reviews";

export default function Feed() {
  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Feed</h1>
        </div>
        <Reviews />
      </div>
    </>
  );
}
