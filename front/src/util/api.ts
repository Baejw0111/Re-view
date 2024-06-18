import axios from "axios";
import { Review } from "./interface";

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get<Review[]>("http://localhost:8080/review");
    return response.data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    throw error;
  }
};
