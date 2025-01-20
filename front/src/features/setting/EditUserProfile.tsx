import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Form } from "@/shared/shadcn-ui/form";
import { RootState } from "@/state/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/api/user";
import { handleEnterKeyDown } from "@/shared/lib/utils";
import {
  profileImageValidation,
  nicknameValidation,
} from "@/shared/types/validation";
import ProfileImageForm from "../form/ProfileImageForm";
import NicknameForm from "../form/NicknameForm";
import { Button } from "@/shared/shadcn-ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function EditUserProfile() {
  const queryClient = useQueryClient();
  const userInfo = useSelector((state: RootState) => state.userInfo); // 사용자 정보
  const [isEditing, setIsEditing] = useState(false); // 프로필 편집 상태
  const [isUploading, setIsUploading] = useState(false); // 프로필 이미지 업로드 상태

  const formSchema = z.object({
    profileImage: profileImageValidation(),
    newNickname: nicknameValidation,
    useDefaultProfile: z.boolean(),
  });

  /**
   * 프로필 업데이트 폼 정의
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImage: new DataTransfer().files,
      newNickname: "",
      useDefaultProfile: true,
    },
  });

  const isDefaultProfile = form.watch("useDefaultProfile"); // 기본 프로필 이미지 사용 여부

  // 프로필 업데이트
  const { mutate: updateUserInfoMutation, isPending } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUserInfo"] });
      setIsEditing(false);
      toast.success("프로필 업데이트 완료");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("프로필 업데이트 과정에서 오류 발생", {
        description: error.response?.data?.message,
      });
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

  // 현재 프로필 정보 폼에 적용
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
        className={`flex flex-col gap-8 mx-auto p-8 border rounded-xl transition-all duration-300 w-2/3 ${
          isEditing ? "bg-card pt-16 w-full sm:w-2/3" : ""
        }`}
      >
        {/* 프로필 이미지 */}
        <ProfileImageForm
          form={form}
          isEditing={isEditing}
          isDefaultProfile={isDefaultProfile}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          userInfo={userInfo}
        />

        {/* 닉네임 */}
        <NicknameForm form={form} isEditing={isEditing} />

        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isUploading || isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            편집
          </Button>
        )}
      </form>
    </Form>
  );
}
