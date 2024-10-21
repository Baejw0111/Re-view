import { useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/shadcn-ui/popover";
import ProfileInfo from "@/features/user/ProfileInfo";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePopOver({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
        className="w-64 flex flex-col gap-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <ProfileInfo userId={userId} />
        <Link to={`/profile/${userId}`}>
          <Button className="w-full ">
            <User className="mr-2 h-4 w-4" />
            프로필 보기
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
}
