import axios, { AxiosError, AxiosInstance } from "axios";
import { Review, UserInfo } from "@/util/interface";

const API_URL = import.meta.env.VITE_API_URL;

// axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 */
export const getKakaoToken = async (code: string): Promise<void> => {
  try {
    const response = await api.post(
      `/login/kakao`,
      { code: code },
      { withCredentials: true }
    );

    console.log(response.data);
  } catch (error) {
    console.error("카카오 토큰 요청 실패:", error);
    throw error;
  }
};

/**
 * 리뷰 리스트를 가져오는 함수
 * @returns 리뷰 리스트
 */
export const fetchReviewList = async (): Promise<Review[]> => {
  try {
    const response = await api.get(`/review`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 리스트 조회 실패:", error);
    throw error;
  }
};

// api 함수 타입 정의
type ApiFunction<T, R> = (data: T) => Promise<R>;

/**
 * 카카오 액세스 토큰 갱신 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const refreshKakaoAccessToken = async (): Promise<void> => {
  try {
    const response = await api.post(
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
      if (error instanceof AxiosError && error.response?.status === 401) {
        try {
          await refreshKakaoAccessToken();
          return await apiFunction(data);
        } catch (refreshError) {
          console.error("토큰 갱신 실패:", refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  };
};

/**
 * 리뷰 업로드 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 * @param formData 전송할 리뷰 정보
 */
export const uploadReview = withTokenRefresh(
  async (formData: FormData): Promise<void> => {
    const response = await api.post(`/review`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
  }
);

/**
 * 카카오 서버에서 유저 정보 조회하는 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 * @returns 유저 정보
 */
export const getKakaoUserInfo = withTokenRefresh(
  async (): Promise<UserInfo> => {
    const response = await api.get(`/auth/kakao/user`, {
      withCredentials: true,
    });
    console.log(response.data);

    return response.data;
  }
);

/**
 * 카카오 서버에서 로그아웃 요청 후 쿠키 삭제
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const logOutKakao = withTokenRefresh(async (): Promise<void> => {
  const response = await api.post(
    `/logout/kakao`,
    {},
    {
      withCredentials: true,
    }
  );
  console.log(response.data);
});
