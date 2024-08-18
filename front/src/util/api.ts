import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 * @returns 카카오 토큰
 */
export const getKakaoToken = async (code: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/login/kakao`,
      { code: code },
      { withCredentials: true }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("카카오 토큰 요청 실패:", error);
    throw error;
  }
};

/**
 * 리뷰 리스트를 가져오는 함수
 * @returns 리뷰 리스트
 */
export const fetchReviewList = async () => {
  try {
    const response = await axios.get(`${API_URL}/review`);
    return response.data;
  } catch (error) {
    console.error("리뷰 리스트 조회 실패:", error);
    throw error;
  }
};

/**
 * 리뷰 업로드 함수
 * @param formData 전송할 리뷰 정보
 * @returns 업로드된 리뷰
 */
export const uploadReview = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/review`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("리뷰 업로드 실패:", error);
    throw error;
  }
};
