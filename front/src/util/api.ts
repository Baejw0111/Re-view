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

/**
 * 리뷰 업로드 함수
 * @param formData 전송할 리뷰 정보
 * @returns 업로드된 리뷰
 */
export const uploadReview = async (formData: FormData): Promise<void> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/review",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("리뷰 업로드 실패:", error);
    throw error;
  }
};
