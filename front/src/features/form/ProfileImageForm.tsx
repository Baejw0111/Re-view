import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { UseFormReturn } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn-ui/avatar";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";
import UserAvatar from "@/features/user/UserAvatar";
import { Camera, LoaderCircle, UserRound, X } from "lucide-react";
import { reviewFieldLimits } from "@/shared/types/validation";
import { convertToWebP } from "@/shared/lib/utils";
import {
  createPreviewImages,
  revokePreviewImages,
  resetFileInput,
} from "@/shared/lib/utils";
import { LoginUserInfo, ProfileFormValues } from "@/shared/types/interface";

export default function ProfileImageForm({
  form,
  isEditing,
  isDefaultProfile,
  isUploading,
  setIsUploading,
  userInfo,
}: {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  isDefaultProfile: boolean;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  userInfo: LoginUserInfo;
}) {
  const [uploadProgress, setUploadProgress] = useState(0); // 프로필 이미지 업로드 진행률
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(""); // 사용자가 현재 등록한 프로필 이미지

  /**
   * 기본 프로필 이미지 핸들러
   */
  const handleDefaultProfileImage = () => {
    setCurrentProfileImage("");
    form.setValue("useDefaultProfile", true);
    form.setValue("profileImage", new DataTransfer().files);

    resetFileInput("profileImage-upload");
  };

  /**
   * 프로필 이미지 업로드 핸들러
   * @param e 프로필 이미지 업로드 이벤트
   */
  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    const newFiles = e.target.files;

    if (newFiles) {
      const webpFiles = await convertToWebP(newFiles, (progress) => {
        setUploadProgress(progress);
      }); // 파일을 webp로 변환
      const previewImage = await createPreviewImages(webpFiles); // 미리보기 이미지 생성
      setCurrentProfileImage(previewImage[0]); // 현재 프로필 이미지 업데이트
      form.setValue("profileImage", webpFiles); // 폼 값 업데이트
      form.setValue("useDefaultProfile", false); // 기본 프로필 이미지 사용 여부 업데이트
    }
    setIsUploading(false);
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 메모리 해제
    return () => {
      revokePreviewImages([currentProfileImage]);
    };
  }, [currentProfileImage]);

  return (
    <FormField
      control={form.control}
      name="profileImage"
      render={() => (
        <>
          <FormItem>
            <FormControl>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <FormLabel
                    htmlFor="profileImage-upload"
                    className={`${isEditing ? "cursor-pointer" : ""}`}
                  >
                    {currentProfileImage.length > 0 || isDefaultProfile ? (
                      <Avatar
                        className={`${
                          isEditing
                            ? "h-24 w-24 transition-transform hover:scale-105 active:scale-105"
                            : "h-32 w-32"
                        }`}
                      >
                        {isUploading ? (
                          <Skeleton className="h-24 w-24 flex items-center justify-center">
                            <LoaderCircle className="w-6 h-6 animate-spin" />
                          </Skeleton>
                        ) : (
                          <>
                            <AvatarImage
                              src={currentProfileImage}
                              alt={userInfo.nickname}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              <UserRound className="w-[70%] h-[70%]" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    ) : (
                      <UserAvatar
                        className={`${
                          isEditing
                            ? "h-24 w-24 transition-transform hover:scale-105 active:scale-105"
                            : "h-32 w-32"
                        }`}
                        profileImage={userInfo.profileImage}
                        nickname={userInfo.nickname}
                      />
                    )}
                    {isEditing && (
                      <div className="absolute bottom-0 right-0 bg-muted-foreground rounded-full p-1 shadow-lg">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </FormLabel>
                  {isEditing && (
                    <>
                      <input
                        id="profileImage-upload"
                        type="file"
                        accept={reviewFieldLimits.imageTypes.join(", ")}
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                      {!isDefaultProfile && (
                        <button
                          type="button"
                          onClick={handleDefaultProfileImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-800 active:bg-red-800 transition-colors"
                          aria-label="프로필 사진 삭제"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                {isEditing && (
                  <span className="text-sm text-muted-foreground">
                    {isUploading
                      ? `이미지 업로드 중... ${uploadProgress}%`
                      : "클릭하여 프로필 사진 업로드"}
                  </span>
                )}
              </div>
            </FormControl>
            {isEditing && <FormMessage />}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
