import { useState, useEffect } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import { motion } from "framer-motion";
import EditUserProfile from "@/features/setting/EditUserProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/shadcn-ui/card";
import MovingLogo from "@/features/common/MovingLogo";
import { Checkbox } from "@/shared/shadcn-ui/checkbox";
import { Label } from "@/shared/shadcn-ui/label";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import TermsDialog from "@/widgets/TermsDialog";
import PrivacyAgreementDialog from "@/widgets/PrivacyAgreementDialog";

export default function Onboarding() {
  const navigate = useNavigate();
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);
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

  useEffect(() => {
    if (userInfo?.isSignedUp) {
      navigate("/");
    }
  }, [userInfo]);

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

          <CardContent>
            <motion.div variants={itemVariants}>
              <EditUserProfile
                isOnboarding
                submitFooter={(isUploading: boolean) => (
                  <CardFooter className="flex flex-col items-center gap-2 p-0">
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
                    <motion.div variants={itemVariants} className="w-full">
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full relative overflow-hidden group"
                        disabled={isUploading || !isAgreementChecked}
                      >
                        <span className="relative z-10">회원 가입 완료</span>
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
                    </motion.div>
                  </CardFooter>
                )}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
