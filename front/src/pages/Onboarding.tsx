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
import { Checkbox } from "@/shared/shadcn-ui/checkbox";
import { Label } from "@/shared/shadcn-ui/label";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import TermsDialog from "@/widgets/TermsDialog";
import PrivacyAgreementDialog from "@/widgets/PrivacyAgreementDialog";
import { signUp, cancelSignUp } from "@/api/auth";
import { useBlocker } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const blocker = useBlocker(true);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 프로필 이미지 업로드 상태
  const [isSignUp, setIsSignUp] = useState(false); // 회원 가입 상태

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
  const { mutate: signUpMutation } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      setIsSignUp(true); // 회원 가입을 성공 시 경고창 생성 방지
      window.location.href = "/";
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
      setIsSignUp(true);
      navigate("/");
    }
  }, [userInfo]);

  // 라우트 간 이동 시 경고창 생성
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (isSignUp) {
        blocker.proceed();
        return;
      }

      const confirmLeave = window.confirm(
        "지금 나가면 회원 가입이 이뤄지지 않습니다. 회원 가입 과정을 취소하시겠습니까?"
      );

      if (confirmLeave) {
        if (!userInfo?.isSignedUp) {
          // 회원 가입 취소
          cancelSignUp();
        }
        blocker.proceed(); // 페이지 이동을 허용
      } else {
        blocker.reset(); // 차단 상태 유지
      }
    }
  }, [blocker, isSignUp]);

  // 새로고침 또는 사이트를 떠나려 할 때 경고창 생성
  useEffect(() => {
    // 회원 가입 완료 시 경고창 생성 방지
    if (isSignUp) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isSignUp]);

  return (
    <div className="pt-20 flex flex-col items-center gap-10">
      <MovingLogo className="w-40 h-40" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-96">
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
              className="flex flex-col gap-4"
            >
              <CardContent>
                <motion.div variants={itemVariants}>
                  {/* 프로필 이미지 */}
                  <ProfileImageForm
                    form={form}
                    isDefaultProfile={isDefaultProfile}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    userInfo={userInfo}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* 닉네임 */}
                  <NicknameForm form={form} />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 w-full my-2"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Checkbox
                      id="agreement"
                      checked={isAgreementChecked}
                      onCheckedChange={() =>
                        setIsAgreementChecked(!isAgreementChecked)
                      }
                    />
                    <Label htmlFor="agreement" className="font-medium">
                      필수 약관에 동의합니다
                    </Label>
                  </div>
                  <div className="w-full text-sm text-muted-foreground">
                    <TermsDialog />및
                    <PrivacyAgreementDialog />에 동의합니다.
                  </div>
                </motion.div>
              </CardContent>

              <motion.div variants={itemVariants} className="w-full">
                <CardFooter>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full relative overflow-hidden group"
                    disabled={isUploading || !isAgreementChecked}
                  >
                    <span className="relative z-10">회원 가입 하기</span>
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500
                      opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 animate-shimmer transition-opacity duration-300"
                    ></span>
                  </Button>
                  <style>{`
                      @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                      }
                      .animate-shimmer {
                        background-size: 200% auto;
                        animation: shimmer 0.5s linear infinite;
                      }
                    `}</style>
                </CardFooter>
              </motion.div>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
