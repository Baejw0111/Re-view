import { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { Button } from "@/shared/shadcn-ui/button";
import { ReviewFormValues } from "@/shared/types/interface";
import { UseFormReturn } from "react-hook-form";
import { IMG_SRC } from "@/shared/constants";
import {
  convertToWebP,
  createPreviewImages,
  revokePreviewImages,
  resetFileInput,
} from "@/shared/lib/utils";
import {
  reviewFieldLimits,
  acceptedExtensions,
} from "@/shared/types/validation";
import { ImagePlus } from "lucide-react";
import UploadProgressBar from "@/features/form/UploadProgressBar";
import LoadingBox from "@/features/form/LoadingBox";
import PreviewImageBox from "@/features/form/PreviewImageBox";

export default function PreviewImageList({
  form,
  initialImages,
  deletedImages,
  isUploading,
  setInitialImages,
  setDeletedImages,
  setIsUploading,
}: {
  form: UseFormReturn<ReviewFormValues>;
  initialImages: string[];
  deletedImages: string[];
  isUploading: boolean;
  setInitialImages: (images: string[]) => void;
  setDeletedImages: (images: string[]) => void;
  setIsUploading: (isUploading: boolean) => void;
}) {
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기 이미지
  const [uploadProgress, setUploadProgress] = useState(0); // 업로드 진행률
  const currentFiles = form.watch("images");

  /**
   * 파일 목록 업데이트 함수
   * @param {FileList} newFiles - 새로운 파일 목록
   * @param {FileList} currentFiles - 현재 파일 목록
   * @returns {FileList} - 업데이트된 파일 목록
   */
  const updateFileList = (
    newFiles: FileList,
    currentFiles: FileList
  ): FileList => {
    const updatedFiles = new DataTransfer();
    Array.from(currentFiles).forEach((file) => updatedFiles.items.add(file));
    Array.from(newFiles).forEach((file) => updatedFiles.items.add(file));
    return updatedFiles.files;
  };

  /**
   * 메인 이미지 업로드 핸들러
   * @description 이미지 업로드 시 미리보기 이미지 생성 및 폼 값 업데이트
   * @param {React.ChangeEvent<HTMLInputElement>} e - 이미지 업로드 이벤트
   * @returns {Promise<void>}
   */
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setUploadProgress(0);
    setIsUploading(true);
    const newFiles = e.target.files;

    if (newFiles) {
      const currentPreviewImages = [...previewImages]; // 현재 미리보기 이미지 상태
      setPreviewImages([...previewImages, ...Array(newFiles.length).fill("")]); // 스켈레톤 표시

      const progressArray = Array(newFiles.length).fill(0); // 업로드 진행률 배열

      // newFiles의 파일들을 webp로 변환
      const webpFiles = await convertToWebP(newFiles, (progress, index) => {
        progressArray[index] = progress;
        const total = progressArray.reduce((acc, curr) => acc + curr, 0);
        setUploadProgress(Math.round(total / newFiles.length));
      });

      const combinedFiles = updateFileList(webpFiles, currentFiles); // 새로운 파일 목록과 현재 업로드된 파일 목록을 합친 파일 목록
      form.setValue("images", combinedFiles); // 폼 값 업데이트

      const newPreviewImages = await createPreviewImages(webpFiles); // 미리보기 이미지 생성
      setPreviewImages([...currentPreviewImages, ...newPreviewImages]); // 미리보기 이미지 업데이트
      resetFileInput("image-upload"); // 파일 입력값 초기화
    }
    setIsUploading(false);
  };

  /**
   * 초기 이미지 제거 핸들러
   * @param {number} index - 이미지 인덱스
   * @returns {void}
   */
  const handleRemoveInitialImage = (index: number): void => {
    setDeletedImages([...deletedImages, initialImages[index]]);
    const newInitialImages = initialImages.filter((_, i) => i !== index);
    setInitialImages(newInitialImages);
  };

  /**
   * 사용자가 현재 업로드한 이미지 제거 핸들러
   * @param {number} index - 이미지 인덱스
   */
  const handleRemoveUploadedImage = (index: number) => {
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviewImages);

    if (currentFiles) {
      const dataTransfer = new DataTransfer(); // 파일 목록을 담을 DataTransfer 객체 생성

      // 현재 업로드된 파일 목록에서 삭제할 파일을 제외한 새로운 파일 목록 생성
      Array.from(currentFiles)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      form.setValue("images", dataTransfer.files);
    }

    resetFileInput("image-upload");
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 메모리 해제
    return () => {
      revokePreviewImages(previewImages);
    };
  }, [previewImages]);

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">파일 업로드</h2>
            <div className="flex flex-col gap-2 text-sm text-left text-foreground bg-muted-foreground/50 p-2 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                <li>최대 5개</li>
                <li>
                  파일 당 최대 {reviewFieldLimits.fileSize / 1024 / 1024}MB
                </li>
                <li>파일 확장자: {acceptedExtensions.join(", ")}</li>
              </ul>
            </div>

            {/* 업로드 이미지 파일 변환 진행 상태바 */}
            <UploadProgressBar
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {/* 초기 이미지(이미 업로드된 이미지들) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {initialImages.map((image, index) => (
                <div key={index}>
                  {image ? (
                    <PreviewImageBox
                      imageSrc={`${IMG_SRC}/${image}`}
                      imageName={image.split(`\\`).pop() || ""}
                      handleRemoveImage={() => handleRemoveInitialImage(index)}
                    />
                  ) : (
                    <LoadingBox />
                  )}
                </div>
              ))}

              {/* 새로 업로드할 이미지들 */}
              {previewImages.map((image, index) => (
                <div key={index}>
                  {image ? (
                    <PreviewImageBox
                      imageSrc={image}
                      imageName={currentFiles[index].name}
                      handleRemoveImage={() => handleRemoveUploadedImage(index)}
                    />
                  ) : (
                    <LoadingBox />
                  )}
                </div>
              ))}

              {/* 이미지 업로드 버튼 */}
              {previewImages.length < reviewFieldLimits.files && (
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-square rounded-md w-full h-full border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground"
                  onClick={() => {
                    document.getElementById("image-upload")?.click();
                  }}
                >
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-sm">이미지 추가</span>
                </Button>
              )}
            </div>

            <FormControl>
              {/* 이미지 업로드 파일 입력(숨겨진 상태로, 이미지 업로드 버튼 클릭 시에만 상호작용 가능) */}
              <input
                id="image-upload"
                type="file"
                multiple // 여러 파일 업로드
                className="hidden"
                onChange={handleImageUpload}
                accept={reviewFieldLimits.imageTypes.join(", ")}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
