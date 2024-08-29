import axios, { AxiosError, AxiosInstance } from "axios";
import { persistor } from "@/state/store";
import { API_URL } from "@/shared/constants";

// axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// api 함수 타입 정의
type ApiFunction<T, R> = (data: T) => Promise<R>;

/**
 * 카카오 액세스 토큰 갱신 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const refreshKakaoAccessToken = async (): Promise<void> => {
  try {
    const response = await apiClient.post(
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

/**
 * 토큰 만료 시 토큰 갱신 후 실패한 요청 재시도
 * @param apiFunction 요청 함수
 * @param data 요청 시 사용할 데이터. 요청 시 사용할 데이터가 없을 경우 아무것도 넣지 않아도 된다.
 * @returns 요청 함수
 */
export const withTokenRefresh = <T = void, R = void>( // 요청 함수 내의 타입 정의. 각 타입의 기본값을 void로 설정
  apiFunction: ApiFunction<T, R>
): ApiFunction<T, R> => {
  return async (data: T): Promise<R> => {
    try {
      return await apiFunction(data);
    } catch (error) {
      const { response } = error as AxiosError;

      // 토큰 만료 시 토큰 갱신
      if (response?.status === 401) {
        try {
          await refreshKakaoAccessToken();
          return await apiFunction(data);
        } catch (refreshError) {
          // refreshToken이 만료된 경우이므로 강제 로그아웃 처리
          console.error("토큰 갱신 실패:", refreshError);
          alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
          await persistor.purge(); // redux-persist가 관리하는 모든 상태 초기화
          window.location.href = "/";
          throw refreshError;
        }
      }
      throw error; // apiFunction 실패 및 401 에러가 아닌 경우 에러 전파
    }
  };
};
