import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/shared/constants";
import { AxiosError, CreateAxiosDefaults, AxiosRequestConfig } from "axios";
import {
  KAKAO_OAUTH_URL,
  KAKAO_REST_API_KEY,
  KAKAO_REDIRECT_URI,
} from "@/shared/constants";

/**
 * axios 인스턴스 생성 함수
 * @param clientConfig axios 인스턴스 생성 옵션
 * @returns axios 인스턴스
 */
const createApiClient = (clientConfig?: CreateAxiosDefaults): AxiosInstance => {
  const client = axios.create({ ...clientConfig });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const { config, response } = error;
      const method = config?.method?.toUpperCase() || "UNKNOWN"; // 실패한 api의 HTTP 메서드
      const errorMessage = `${method} ${config?.url} 요청 실패:`;
      console.error(errorMessage, response?.data);
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * 일반 인스턴스
 */
export const generalApiClient: AxiosInstance = createApiClient({
  baseURL: API_URL,
});

/**
 * 인증용 인스턴스
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const authApiClient: AxiosInstance = createApiClient({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * 카카오 액세스 토큰 갱신 함수
 */
export const refreshKakaoAccessToken = async (): Promise<void> => {
  // 인터셉터로 인한 무한 루프 방지를 위해 generalApiClient 사용
  const response = await generalApiClient.post(
    `/auth/kakao/refresh`,
    {},
    {
      withCredentials: true,
    }
  );

  console.log(response.data);
};

// 토큰 만료 시 토큰 갱신 후 실패한 요청 재시도하도록 authApiClient에 인터셉터 추가
authApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    if (response?.status === 401) {
      try {
        await refreshKakaoAccessToken();
        return authApiClient(error.config as AxiosRequestConfig);
      } catch (refreshError) {
        // refreshToken이 만료된 경우이므로 강제 로그아웃 처리
        alert("로그인해주세요.");
        window.location.href = `${KAKAO_OAUTH_URL}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
