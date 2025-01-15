import { useState, useEffect } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { writeReview, editReview } from "@/api/review";
import { Button } from "@/shared/shadcn-ui/button";
import { Form } from "@/shared/shadcn-ui/form";
import { Card } from "@/shared/shadcn-ui/card";
import { ReviewInfo } from "@/shared/types/interface";
import { handleEnterKeyDown } from "@/shared/lib/utils";
import {
  titleValidation,
  reviewImagesValidation,
  reviewTextValidation,
  ratingValidation,
  tagsValidation,
  isSpoilerValidation,
} from "@/shared/types/validation";
import TitleForm from "@/features/form/TitleForm";
import RatingForm from "@/features/form/RatingForm";
import ReviewTextForm from "@/features/form/ReviewTextForm";
import PreviewImageList from "@/widgets/PreviewImageList";
import SpoilerSwitch from "@/features/form/SpoilerSwitch";
import TagForm from "@/features/form/TagForm";
import { Separator } from "@/shared/shadcn-ui/separator";
import { toast } from "sonner";

export default function ReviewForm({
  reviewInfo,
}: {
  reviewInfo?: ReviewInfo;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [initialImages, setInitialImages] = useState<string[]>(
    reviewInfo?.images || []
  ); // 초기 이미지(기존에 작성한 리뷰에 첨부된 이미지)
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 삭제할 이미지
  const [isUploading, setIsUploading] = useState(false); // 리뷰 이미지 업로드 상태
  const blocker = useBlocker(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  /**
   * 리뷰 업로드 시 필드 검증 스키마
   */
  const formSchema = z.object({
    title: titleValidation,
    images: reviewImagesValidation(initialImages),
    reviewText: reviewTextValidation,
    rating: ratingValidation,
    tags: tagsValidation,
    isSpoiler: isSpoilerValidation,
  });

  /**
   * 리뷰 업로드 시 필드 검증 폼
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: reviewInfo ? reviewInfo.title : "",
      images: new DataTransfer().files,
      reviewText: reviewInfo ? reviewInfo.reviewText : "",
      rating: reviewInfo ? reviewInfo.rating : -1,
      tags: reviewInfo ? reviewInfo.tags : [],
      isSpoiler: reviewInfo ? reviewInfo.isSpoiler : false,
    },
  });

  // 리뷰 업로드
  const { mutate: writeReviewMutation } = useMutation({
    mutationFn: writeReview,
    onSuccess: () => {
      setIsFormSubmitted(true);
      toast.success("리뷰가 업로드되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["feed", "latest"],
      });
      navigate("/");
    },
  });

  // 리뷰 수정
  const { mutate: editReviewMutation } = useMutation({
    mutationFn: (formData: FormData) =>
      editReview(reviewInfo?.aliasId as string, formData),
    onSuccess: () => {
      setIsFormSubmitted(true);
      toast.success("리뷰가 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["reviewInfo", reviewInfo?.aliasId],
      });
      navigate(-1);
    },
  });

  /**
   * 업로드 제출 시 실행될 작업
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 폼 값 처리
    const { title, reviewText, rating, tags, images, isSpoiler } = values;

    const formData = new FormData();
    const fieldsToCheck = {
      title,
      reviewText,
      rating: rating.toString(),
      isSpoiler: isSpoiler.toString(),
    };

    if (reviewInfo) {
      // 리뷰 수정인 경우

      // 수정된 필드만 폼 데이터에 추가
      Object.entries(fieldsToCheck).forEach(([key, value]) => {
        if (reviewInfo?.[key as keyof ReviewInfo] !== value) {
          formData.append(key, value);
        }
      });

      // 현재 태그 목록이 이전 태그 목록과 서로 같은지 확인
      const sortedNewTags = tags.sort();
      const sortedOldTags = reviewInfo?.tags.sort();

      if (sortedNewTags.join(",") !== sortedOldTags?.join(",")) {
        tags.forEach((tag) => formData.append("tags[]", tag));
      }

      // 이미지 업데이트
      deletedImages.forEach((image) =>
        formData.append("deletedImages[]", image)
      );
      [...images].forEach((image) => formData.append("images", image));

      editReviewMutation(formData);
    } else {
      // 새 리뷰 작성인 경우
      Object.entries(fieldsToCheck).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("uploadTime", new Date().toISOString());
      tags.forEach((tag) => formData.append("tags", tag));
      [...images].forEach((image) => formData.append("images", image));

      writeReviewMutation(formData);
    }
  };

  // 라우트 간 이동 시 경고창 생성
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (isFormSubmitted) {
        blocker.proceed();
        return;
      }

      const confirmLeave = window.confirm(
        "작성 중인 내용을 잃게 됩니다. 정말 나가시겠습니까?"
      );

      if (confirmLeave) {
        blocker.proceed(); // 페이지 이동을 허용
      } else {
        blocker.reset(); // 차단 상태 유지
      }
    }
  }, [blocker, isFormSubmitted]);

  // 새로고침 또는 사이트를 떠나려 할 때 경고창 생성
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Card className="p-6 md:p-8 max-w-screen-md mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={handleEnterKeyDown}
          className="flex flex-col gap-6"
        >
          {/* 제목 */}
          <TitleForm form={form} />

          {/* 평점 */}
          <RatingForm form={form} defaultValue={reviewInfo?.rating} />

          {/* 리뷰 본문 */}
          <ReviewTextForm form={form} />

          <Separator />

          {/* 태그 입력 */}
          <TagForm form={form} />

          <Separator />

          {/* 이미지 업로드 */}
          <PreviewImageList
            form={form}
            initialImages={initialImages}
            deletedImages={deletedImages}
            isUploading={isUploading}
            setInitialImages={setInitialImages}
            setDeletedImages={setDeletedImages}
            setIsUploading={setIsUploading}
          />

          {/* 하단부(스포일러 스위치, 리뷰 업로드 버튼) */}
          <div className="flex items-center gap-4 justify-end">
            {/* 스포일러 스위치 */}
            <SpoilerSwitch form={form} />

            {/* 리뷰 업로드 버튼 */}
            <Button type="submit" className="font-bold" disabled={isUploading}>
              {isUploading
                ? "파일 업로드 중..."
                : reviewInfo
                ? "리뷰 수정"
                : "리뷰 업로드"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
