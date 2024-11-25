import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getChoseong } from "es-hangul";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 텍스트 입력 창에서 엔터 키 입력 시 제출 방지
 * @param e 엔터 키 입력 이벤트
 */
export const handleEnterKeyDown = (e: React.KeyboardEvent) => {
  if (
    e.key === "Enter" &&
    e.target instanceof HTMLInputElement &&
    e.target.type !== "textarea"
  ) {
    e.preventDefault();
  }
};

/**
 * 파일을 데이터 URL로 변환하는 함수
 * @param file 파일
 * @returns 데이터 URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

/**
 * 파일을 미리보기 이미지로 변환하는 함수
 * @param files 파일 목록
 * @returns 미리보기 이미지 목록
 */
export const createPreviewImages = async (files: FileList) => {
  const previewImages: string[] = [];
  for (const file of Array.from(files)) {
    const dataUrl = await readFileAsDataURL(file);
    previewImages.push(dataUrl);
  }
  return previewImages;
};

/**
 * 파일 목록을 webp 형식으로 변환
 * @param {FileList} files - 파일 목록
 * @param {Function} onProgressCallback - 진행률 콜백 함수
 * @returns {Promise<FileList>} - webp 형식의 파일 목록
 */
export const convertToWebP = async (
  files: FileList,
  onProgressCallback: (progress: number, index: number) => void
): Promise<FileList> => {
  const webpDataTransfer = new DataTransfer();

  // 이미지 압축 옵션
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    onProgress: (progress: number) => {
      console.log(`압축 진행률: ${progress}%`);
    },
  };

  // 각 파일을 webp로 변환
  for (const [index, file] of Array.from(files).entries()) {
    try {
      // webp 파일이면 원본 파일 추가
      if (file.type === "image/webp") {
        webpDataTransfer.items.add(file);
        onProgressCallback(100, index);
        continue;
      }

      options.onProgress = (progress) => {
        onProgressCallback(progress, index);
      };

      // 이미지 압축 및 webp 변환
      const compressedFile = await imageCompression(file, options);

      // 파일 이름을 .webp 확장자로 변경
      const webpFile = new File(
        [compressedFile],
        file.name.replace(/\.[^/.]+$/, "") + ".webp",
        { type: "image/webp" }
      );

      webpDataTransfer.items.add(webpFile);
    } catch (error) {
      console.error("이미지 변환 중 오류 발생:", error);
    }
  }

  return webpDataTransfer.files;
};

/**
 * 파일 입력값 초기화
 * @param fileInputId 파일 입력 아이디
 */
export const resetFileInput = (fileInputId: string) => {
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
};

/**
 * 시간 계산 함수
 * @param time 시간
 * @returns 시간 계산 결과
 */
export const claculateTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `방금 전`;
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  if (months < 12) return `${months}달 전`;
  return `${years}년 전`;
};

/**
 * 검색 필터
 * @param {string} value - 검색 값
 * @param {string} searchQuery - 검색 쿼리
 * @returns {number} 검색 필터 결과
 */
export const filterCommand = (value: string, searchQuery: string) => {
  const cleanValue = value.replace(/^(recent-search-|related-tag-)/, ""); // 진짜 value 값만 추출
  const searchQueryWithoutSpace = searchQuery.replace(/\s/g, ""); // 공백 제거한 버전의 검색 쿼리

  const koreanInitialsValue = getChoseong(cleanValue); // value에서 한글 초성 추출

  const koreanInitialsSearchQuery = getChoseong(searchQuery); // 검색 쿼리에서 한글 초성 추출
  const koreanInitialsSearchQueryWithoutSpace =
    koreanInitialsSearchQuery.replace(/\s/g, ""); // 공백 제거한 버전의 검색 쿼리에서 한글 초성 추출

  if (
    cleanValue.includes(searchQuery) ||
    cleanValue.includes(searchQueryWithoutSpace)
  ) {
    // 검색 쿼리가 포함된 경우
    return 1;
  } else if (
    koreanInitialsValue &&
    koreanInitialsSearchQuery &&
    (koreanInitialsValue.includes(koreanInitialsSearchQuery) ||
      koreanInitialsValue.includes(koreanInitialsSearchQueryWithoutSpace))
  ) {
    // 검색 쿼리의 한글 초성이 포함된 경우
    return 1;
  }

  return 0;
};
