import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const formSchema = z.object({
  title: z.string().min(1, {
    message: "제목을 입력해주세요.",
  }),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "하나 이상의 이미지를 업로드해야 합니다.",
    })
    .refine((files) => files.length <= 5, {
      message: "이미지 파일은 최대 5개까지 업로드 가능합니다.",
    })
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `파일 크기는 5MB 이하여야 합니다.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "JPEG, PNG, WEBP 형식의 이미지만 허용됩니다."
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          /\.(jpg|jpeg|png|webp)$/i.test(file.name)
        ),
      "올바른 파일 확장자(.jpg, .jpeg, .png, .webp)를 가진 이미지만 허용됩니다."
    ),
  reviewText: z.string().min(1, {
    message: "리뷰 내용을 입력해주세요.",
  }),
  rating: z.number().nonnegative({
    message: "평점을 입력해주세요.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "태그는 최소 1개 이상이어야 합니다.",
  }),
});
