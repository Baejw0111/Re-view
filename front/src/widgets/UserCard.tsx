import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/shadcn-ui/card";
import ProfileInfo from "@/features/user/ProfileInfo";

export default function UserCard({
  userId,
  className,
}: {
  userId: number;
  className?: string;
}) {
  return (
    <Card className={cn("flex justify-center p-8 max-w-xl mx-auto", className)}>
      <ProfileInfo userId={userId} profileImageSize="sm" />
    </Card>
  );
}
