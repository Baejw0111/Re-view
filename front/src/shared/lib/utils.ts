import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
