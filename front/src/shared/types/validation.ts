import { z } from "zod";

export const reviewFieldLimits = {
  title: 20,
  reviewText: 2000,
  tags: 5,
  files: 5,
  fileSize: 20 * 1024 * 1024, // 20MB
  imageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

// MIME 타입에서 확장자 추출
export const acceptedExtensions = reviewFieldLimits.imageTypes.map(
  (type) => type.split("/")[1]
);

// 정규식 생성
const extensionRegex = new RegExp(`\\.(${acceptedExtensions.join("|")})$`, "i");

/**
 * 제목 유효성 검사
 */
export const titleValidation = z
  .string()
  .min(1, { message: "제목을 입력해주세요." })
  .max(reviewFieldLimits.title, {
    message: `제목은 최대 ${reviewFieldLimits.title}자까지 입력할 수 있습니다.`,
  });

/**
 * 공통 이미지 유효성 검사 로직
 * @param maxFiles 최대 업로드 가능한 이미지 개수
 * @param isRequired 이미지 업로드 필수 여부
 * @param initialImages 초기 이미지 목록
 * @returns 유효성 검사 스키마
 */
// 공통 이미지 유효성 검사 로직
const commonImageValidation = (
  maxFiles: number,
  isRequired: boolean = true,
  initialImages: string[] = []
) => {
  return z
    .instanceof(FileList)
    .refine((files) => !isRequired || files.length + initialImages.length > 0, {
      message: "하나 이상의 이미지를 업로드해야 합니다.",
    })
    .refine((files) => files.length + initialImages.length <= maxFiles, {
      message: `이미지 파일은 최대 ${maxFiles}개까지 업로드 가능합니다.`,
    })
    .refine(
      (files) =>
        Array.from(files).every(
          (file) => file.size <= reviewFieldLimits.fileSize
        ),
      `파일 크기는 ${
        reviewFieldLimits.fileSize / 1024 / 1024
      }MB 이하여야 합니다.`
    )
    .refine(
      // 이미지 MIME 타입 검증
      (files) =>
        Array.from(files).every((file) =>
          reviewFieldLimits.imageTypes.includes(file.type)
        ),
      `${reviewFieldLimits.imageTypes
        .map((type) => type.split("/")[1].toUpperCase())
        .join(", ")} 형식의 이미지만 허용됩니다.`
    )
    .refine(
      // 파일 확장자 검증
      (files) =>
        Array.from(files).every((file) => extensionRegex.test(file.name)),
      `올바른 파일 확장자(${reviewFieldLimits.imageTypes
        .map((type) => type.split("/")[1])
        .join(", ")})를 가진 이미지만 허용됩니다.`
    );
};

/**
 * 리뷰 이미지 유효성 검사
 * @param initialImages 초기 이미지 목록
 * @returns 유효성 검사 스키마
 */
export const reviewImagesValidation = (initialImages: string[]) =>
  commonImageValidation(reviewFieldLimits.files, true, initialImages);

/**
 * 리뷰 내용 유효성 검사
 */
export const reviewTextValidation = z
  .string()
  .min(1, { message: "리뷰 내용을 입력해주세요." })
  .max(reviewFieldLimits.reviewText, {
    message: `리뷰 내용은 최대 ${reviewFieldLimits.reviewText}자까지 입력할 수 있습니다.`,
  })
  .refine((text) => text.trim().length > 0, {
    message: "리뷰 내용은 공백만 입력할 수 없습니다.",
  });

/**
 * 평점 유효성 검사
 */
export const ratingValidation = z.number().nonnegative({
  message: "평점을 입력해주세요.",
});

/**
 * 태그 유효성 검사
 */
export const tagsValidation = z
  .array(z.string())
  .min(1, { message: "태그는 최소 1개 이상이어야 합니다." })
  .max(reviewFieldLimits.tags, {
    message: `태그는 최대 ${reviewFieldLimits.tags}개까지 입력할 수 있습니다.`,
  });

/**
 * 스포일러 여부 유효성 검사
 */
export const isSpoilerValidation = z.boolean();

/**
 * 프로필 이미지 유효성 검사
 * @returns 유효성 검사 스키마
 */
export const profileImageValidation = () => commonImageValidation(1, false);

/**
 * 닉네임 유효성 검사
 */
export const nicknameValidation = z
  .string()
  .min(1, { message: "닉네임을 입력해주세요." })
  .max(10, { message: "닉네임은 최대 10자까지 입력할 수 있습니다." })
  .refine((nickname) => !nickname.includes("운영자"), {
    message: "닉네임에 '운영자'가 포함될 수 없습니다.",
  });
