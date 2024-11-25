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

export default function OnboardingPage() {
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

  return (
    <div className="pt-20 flex flex-col items-center justify-center gap-10">
      <MovingLogo className="w-40 h-40" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-96">
          <CardHeader>
            <motion.h1
              className="text-2xl font-bold text-center"
              variants={itemVariants}
            >
              환영합니다!
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
                submitFooter={(isUploading: boolean) => (
                  <motion.div variants={itemVariants}>
                    <CardFooter className="p-0">
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full relative overflow-hidden group"
                        disabled={isUploading}
                      >
                        <span className="relative z-10">프로필 설정 완료</span>
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
                )}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
