import { Button } from "@/shared/shadcn-ui/button";
import { Input } from "@/shared/shadcn-ui/input";
import { Triangle, Search, Star, User } from "lucide-react";
import { useState } from "react";
import { updateUserNickname } from "@/api/userSetting";

export default function Onboarding() {
  const [newNickname, setNewNickname] = useState("");

  const handleUpdateNickname = async () => {
    await updateUserNickname(newNickname);
    window.location.href = "/";
  };

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto py-12 md:py-20 lg:py-24">
        <div className="mx-4 rounded-lg bg-card p-6 md:mx-6 md:p-8 lg:mx-8 lg:p-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <Triangle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                올평에 오신 것을 환영합니다!
              </h1>
            </div>
            <p className="text-muted-foreground">
              활동하면서 사용할 닉네임을 설정하고 바로 시작하세요.
            </p>
            <Input onChange={(e) => setNewNickname(e.target.value)} />
            <Button onClick={handleUpdateNickname} className="font-bold">
              시작하기
            </Button>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <Search className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-semibold">Search for Reviews</h3>
                <p className="text-center text-muted-foreground">
                  Find reviews on the products or services you're interested in.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Star className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-semibold">Write Reviews</h3>
                <p className="text-center text-muted-foreground">
                  Share your experiences and help others make informed
                  decisions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <User className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-semibold">Create an Account</h3>
                <p className="text-center text-muted-foreground">
                  Sign up to save your favorite reviews and get personalized
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
