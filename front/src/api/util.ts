import axios, { AxiosInstance } from "axios";
import { persistor } from "@/state/store";
import { API_URL } from "@/shared/constants";

// axios 인스턴스 생성

// 일반 인스턴스
export const genaralApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
});

/**
 * 인증용 인스턴스
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const authApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * 카카오 액세스 토큰 갱신 함수
 */
export const refreshKakaoAccessToken = async (): Promise<void> => {
  try {
    // 인터셉터로 인한 무한 루프 방지를 위해 generalApiClient 사용
    const response = await genaralApiClient.post(
      `/auth/kakao/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("카카오 액세스 토큰 갱신 실패:", error);
    throw error;
  }
};

// 토큰 만료 시 토큰 갱신 후 실패한 요청 재시도
authApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        await refreshKakaoAccessToken();
        return authApiClient(error.response.config);
      } catch (refreshError) {
        // refreshToken이 만료된 경우이므로 강제 로그아웃 처리
        console.error("토큰 갱신 실패:", refreshError);
        alert("다시 로그인해주세요.");
        await persistor.purge(); // redux-persist가 관리하는 모든 상태 초기화
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
