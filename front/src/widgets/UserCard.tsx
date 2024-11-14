import { Link } from "react-router-dom";
import { Card } from "@/shared/shadcn-ui/card";
import ProfileInfo from "@/features/user/ProfileInfo";

export default function UserCard({ userId }: { userId: number }) {
  return (
    <Link to={`/profile/${userId}`}>
      <Card className="flex justify-center p-8 max-w-xl mx-auto shadow-lg transition-shadow hover:shadow-xl active:shadow-xl hover:bg-muted active:bg-muted">
        <ProfileInfo userId={userId} profileImageSize="sm" />
      </Card>
    </Link>
  );
}
