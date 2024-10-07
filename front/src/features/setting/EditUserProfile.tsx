import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button } from "@/shared/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/shared/shadcn-ui/dialog";
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
import { UserRound } from "lucide-react";
import UserProfile from "@/features/user/UserProfile";
import { handleEnterKeyDown, createPreviewImages } from "@/shared/lib/utils";

export default function EditUserProfile() {
  const userInfo = useSelector((state: RootState) => state.userInfo); // 사용자 정보
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(""); // 현재 프로필 이미지

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
      window.location.reload();
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

  /**
   * 사용자 입력 정보 초기화
   */
  const initializeState = () => {
    form.setValue("profileImage", new DataTransfer().files);
    form.setValue("newNickname", userInfo.nickname);
    form.setValue("useDefaultProfile", false);
  };

  return (
    <Dialog onOpenChange={initializeState}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          프로필 편집
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        <DialogDescription hidden></DialogDescription>
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
                        {currentProfileImage.length > 0 ||
                        form.getValues("useDefaultProfile") ? (
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={currentProfileImage}
                              alt={userInfo.nickname}
                            />
                            <AvatarFallback>
                              <UserRound className="w-[70%] h-[70%]" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <UserProfile
                            className="h-24 w-24"
                            profileImage={userInfo.profileImage}
                            nickname={userInfo.nickname}
                          />
                        )}
                        <Input
                          id="profileImage-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                          className="hidden"
                          onChange={handleProfileImageUpload}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              document
                                .getElementById("profileImage-upload")
                                ?.click();
                            }}
                          >
                            프로필 사진 업로드
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDefaultProfileImage}
                          >
                            기본 프로필로 변경
                          </Button>
                        </div>
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
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
