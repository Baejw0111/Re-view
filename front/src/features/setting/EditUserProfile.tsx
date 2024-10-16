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
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/shared/constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/api/userSetting";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn-ui/avatar";
import { Camera, UserRound, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import { handleEnterKeyDown, createPreviewImages } from "@/shared/lib/utils";
import { useLocation } from "react-router-dom";

export default function EditUserProfile({
  submitFooter,
}: {
  submitFooter: React.ReactNode;
}) {
  const userInfo = useSelector((state: RootState) => state.userInfo); // 사용자 정보
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(""); // 사용자가 현재 등록한 프로필 이미지
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop();

  const formSchema = z.object({
    profileImage: z
      .instanceof(FileList)
      .refine((files) => files.length <= 1, {
        message: "하나의 이미지만 업로드할 수 있습니다.",
      })
      .refine(
        (files) =>
          Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
        `파일 크기는 5MB 이하여야 합니다.`
      )
      .refine(
        // 이미지 MIME 타입 검증
        (files) =>
          Array.from(files).every((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type)
          ),
        "JPEG, PNG, WEBP 형식의 이미지만 허용됩니다."
      )
      .refine(
        // 이미지 확장자 검증
        (files) =>
          Array.from(files).every((file) =>
            /\.(jpg|jpeg|png|webp)$/i.test(file.name)
          ),
        "올바른 파일 확장자(.jpg, .jpeg, .png, .webp)를 가진 이미지만 허용됩니다."
      ),
    newNickname: z
      .string()
      .min(1, {
        message: "닉네임을 입력해주세요.",
      })
      .max(10, {
        message: "닉네임은 최대 10자까지 입력할 수 있습니다.",
      }),
    useDefaultProfile: z.boolean(),
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

  const { mutate: updateUserInfoMutation } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      if (currentPage === "onboarding") {
        window.location.href = "/";
      } else {
        window.location.reload();
      }
    },
    onError: () => {
      alert("프로필 업데이트 중 에러가 발생했습니다.");
      window.location.reload();
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
    const newFiles = e.target.files;
    if (newFiles) {
      console.log(
        "업로드된 파일:",
        Array.from(newFiles).map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
        })),
        form.getValues("newNickname")
      );

      const previewImage = await createPreviewImages(newFiles);
      setCurrentProfileImage(previewImage[0]);
      form.setValue("profileImage", newFiles);
      form.setValue("useDefaultProfile", false);
    }
  };

  /**
   * 기본 프로필 이미지 핸들러
   */
  const handleDefaultProfileImage = () => {
    setCurrentProfileImage("");
    form.setValue("useDefaultProfile", true);
    form.setValue("profileImage", new DataTransfer().files);
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
                        {currentProfileImage.length > 0 ||
                        form.getValues("useDefaultProfile") ? (
                          <Avatar className="h-24 w-24 transition-transform hover:scale-105 active:scale-105">
                            <AvatarImage
                              src={currentProfileImage}
                              alt={userInfo.nickname}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              <UserRound className="w-[70%] h-[70%]" />
                            </AvatarFallback>
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
                      <Input
                        id="profileImage-upload"
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                      {!form.getValues("useDefaultProfile") && (
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
                      클릭하여 프로필 사진 업로드
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
                    <FormLabel htmlFor="newNickname">닉네임</FormLabel>
                    <Input id="newNickname" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        {submitFooter}
      </form>
    </Form>
  );
}
