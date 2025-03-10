import { useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/shadcn-ui/popover";
import ProfileInfo from "@/features/user/ProfileInfo";
import { User } from "lucide-react";
import { Link } from "react-router";
import { fetchUserInfoById } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePopOver({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfoById(userId),
    enabled: !!userId,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        className="hover:bg-accent active:bg-accent rounded-md"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col gap-6 w-80"
        sideOffset={0}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {userInfo && (
          <>
            <ProfileInfo userInfo={userInfo} profileImageSize="sm" />
            <Button className="w-full font-bold" asChild>
              <Link to={`/profile/${userId}`}>
                <User className="mr-2 h-4 w-4" />
                프로필 보기
              </Link>
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
