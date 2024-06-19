import axios from "axios";
import { Review } from "./interface";

/**
 * 리뷰 리스트를 가져오는 함수
 * @returns 리뷰 리스트
 */
export const fetchReviewList = async (): Promise<Review[]> => {
  try {
    const response = await axios.get<Review[]>("http://localhost:8080/review");
    return response.data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    throw error;
  }
};
