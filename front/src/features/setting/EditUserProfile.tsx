import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Input } from "@/shared/shadcn-ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { RootState } from "@/state/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn-ui/avatar";
import { Camera, LoaderCircle, UserRound, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import {
  handleEnterKeyDown,
  createPreviewImages,
  convertToWebP,
  resetFileInput,
  revokePreviewImages,
} from "@/shared/lib/utils";
import { useLocation } from "react-router-dom";
import {
  profileImageValidation,
  nicknameValidation,
  useDefaultProfileValidation,
  reviewFieldLimits,
} from "@/shared/types/validation";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";

export default function EditUserProfile({
  submitFooter,
}: {
  submitFooter: (isUploading: boolean) => React.ReactNode;
}) {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop();
  const userInfo = useSelector((state: RootState) => state.userInfo); // 사용자 정보
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(""); // 사용자가 현재 등록한 프로필 이미지
  const [isUploading, setIsUploading] = useState(false); // 프로필 이미지 업로드 상태
  const [uploadProgress, setUploadProgress] = useState(0); // 프로필 이미지 업로드 진행률

  const formSchema = z.object({
    profileImage: profileImageValidation(),
    newNickname: nicknameValidation,
    useDefaultProfile: useDefaultProfileValidation,
  });

  /**
   * 프로필 업데이트 폼
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImage: new DataTransfer().files,
      newNickname: "",
      useDefaultProfile: false,
    },
  });

  const isDefaultProfile = form.watch("useDefaultProfile"); // 기본 프로필 이미지 사용 여부

  // 프로필 업데이트
  const { mutate: updateUserInfoMutation } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      if (currentPage === "onboarding") {
        window.location.href = "/";
      } else {
        window.location.reload();
      }
    },
  });

  /**
   * 프로필 업데이트 제출 함수
   * @param values 프로필 업데이트 제출 값
   */
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { profileImage, newNickname, useDefaultProfile } = values;
    const formData = new FormData();
    formData.append("profileImage", profileImage[0]);
    formData.append("newNickname", newNickname);
    formData.append("useDefaultProfile", useDefaultProfile.toString());
    updateUserInfoMutation(formData);
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

  /**
   * 기본 프로필 이미지 핸들러
   */
  const handleDefaultProfileImage = () => {
    setCurrentProfileImage("");
    form.setValue("useDefaultProfile", true);
    form.setValue("profileImage", new DataTransfer().files);

    resetFileInput("profileImage-upload");
  };

  useEffect(() => {
    form.setValue("profileImage", new DataTransfer().files);
    form.setValue("newNickname", userInfo.nickname);
    if (userInfo.profileImage.length > 0) {
      form.setValue("useDefaultProfile", false);
    } else {
      form.setValue("useDefaultProfile", true);
    }
  }, [userInfo, form]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 메모리 해제
    return () => {
      revokePreviewImages([currentProfileImage]);
    };
  }, [currentProfileImage]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={handleEnterKeyDown}
        className="flex flex-col gap-4"
      >
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
                        className="cursor-pointer"
                      >
                        {currentProfileImage.length > 0 || isDefaultProfile ? (
                          <Avatar className="h-24 w-24 transition-transform hover:scale-105 active:scale-105">
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
                            className="h-24 w-24 transition-transform hover:scale-105 active:scale-105"
                            profileImage={userInfo.profileImage}
                            nickname={userInfo.nickname}
                          />
                        )}
                        <div className="absolute bottom-0 right-0 bg-muted-foreground rounded-full p-1 shadow-lg">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </FormLabel>
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
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isUploading
                        ? `이미지 업로드 중... ${uploadProgress}%`
                        : "클릭하여 프로필 사진 업로드"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="newNickname"
          render={({ field }) => (
            <>
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-bold">닉네임</div>
                    <Input id="newNickname" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        {submitFooter(isUploading)}
      </form>
    </Form>
  );
}
