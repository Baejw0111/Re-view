import { useEffect, useState } from "react";
import axios from "axios";
import { Review } from "@/interface";
import ReviewCard from "./ReviewCard";

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/review");
        const result = response.data;
        console.log(result);
        setReviews(result);
      } catch (error) {
        console.error("Fetching data failed:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Latest Reviews</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Discover the best products
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} reviewData={review} />
          ))}
        </div>
      </div>
    </>
  );
}
