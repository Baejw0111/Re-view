export const API_URL = import.meta.env.VITE_API_URL;
export const KAKAO_AUTH_URL = import.meta.env.VITE_KAKAO_AUTH_URL;
export const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL;
export const NAVER_AUTH_URL = import.meta.env.VITE_NAVER_AUTH_URL;
export const IMG_SRC = import.meta.env.VITE_IMG_SRC;
export const TERM_VERSION = 20250115;
export const PRIVACY_VERSION = 20250115;
export const authUrlVariants: Record<string, string> = {
  google: GOOGLE_AUTH_URL,
  kakao: KAKAO_AUTH_URL,
  naver: NAVER_AUTH_URL,
};
