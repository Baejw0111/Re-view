import { useState, useEffect } from "react";
import { Form } from "@/shared/shadcn-ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  profileImageValidation,
  nicknameValidation,
} from "@/shared/types/validation";
import { handleEnterKeyDown } from "@/shared/lib/utils";
import { Button } from "@/shared/shadcn-ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/shadcn-ui/card";
import MovingLogo from "@/features/common/MovingLogo";
import ProfileImageForm from "@/features/form/ProfileImageForm";
import NicknameForm from "@/features/form/NicknameForm";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { signUp, cancelSignUp } from "@/api/auth";
import TermsAgreement from "@/features/form/TermsAgreement";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Onboarding() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 프로필 이미지 업로드 상태

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  /**
   * 회원 가입 폼 스키마 정의
   */
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
  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("회원 가입 과정에서 오류 발생", {
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
    signUpMutation(formData);
  };

  useEffect(() => {
    // 이미 회원가입 된 사용자가 Onboarding 페이지에 접속한 경우 메인 페이지로 이동
    if (userInfo?.isSignedUp) {
      navigate("/");
    }
  }, [userInfo]);

  return (
    <div className="md:pt-20 flex flex-col items-center md:gap-10">
      <MovingLogo className="w-40 h-40" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-80 md:w-96 mb-10">
          <CardHeader>
            <motion.h1 className="text-2xl font-bold" variants={itemVariants}>
              회원 가입
            </motion.h1>
          </CardHeader>

          <CardDescription className="text-center mb-8">
            <motion.span variants={itemVariants}>
              프로필을 설정해주세요.
            </motion.span>
          </CardDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={handleEnterKeyDown}
            >
              <CardContent className="flex flex-col gap-4">
                <motion.div variants={itemVariants}>
                  {/* 프로필 이미지 */}
                  <ProfileImageForm
                    form={form}
                    isDefaultProfile={isDefaultProfile}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    userInfo={userInfo}
                    isEditing={true}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* 닉네임 */}
                  <NicknameForm form={form} isEditing={true} />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 w-full my-2"
                >
                  <TermsAgreement
                    isAgreementChecked={isAgreementChecked}
                    setIsAgreementChecked={setIsAgreementChecked}
                  />
                </motion.div>
              </CardContent>

              <motion.div variants={itemVariants} className="w-full">
                <CardFooter className="flex flex-col gap-10">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full relative overflow-hidden group"
                    disabled={isUploading || !isAgreementChecked || isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="relative z-10 font-bold">
                          회원 가입 중...
                        </span>
                        <span
                          className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500
                      opacity-100 animate-shimmer transition-opacity duration-300"
                        ></span>
                      </>
                    ) : (
                      <span className="relative z-10">회원 가입</span>
                    )}
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500
                      opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-300"
                    ></span>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={cancelSignUp}
                  >
                    회원 가입 취소 및 홈으로 이동
                  </Button>
                </CardFooter>
              </motion.div>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
