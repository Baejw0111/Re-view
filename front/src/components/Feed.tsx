import { useEffect, useState } from "react";
import axios from "axios";
import { Review } from "../interface";

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
    <div>
      {reviews.map((review, index) => (
        <div key={index}>{review.title}</div>
      ))}
    </div>
  );
}
