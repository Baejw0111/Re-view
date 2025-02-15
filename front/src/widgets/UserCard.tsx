import { Link } from "react-router";
import { Card } from "@/shared/shadcn-ui/card";
import ProfileInfo from "@/features/user/ProfileInfo";
import { UserInfo } from "@/shared/types/interface";

export default function UserCard({ userInfo }: { userInfo: UserInfo }) {
  return (
    <Link to={`/profile/${userInfo.aliasId}`}>
      <Card className="flex justify-center items-center p-8 max-w-xl h-48 mx-auto shadow-lg transition-shadow hover:shadow-xl active:shadow-xl hover:bg-muted active:bg-muted">
        <ProfileInfo userInfo={userInfo} profileImageSize="sm" />
      </Card>
    </Link>
  );
}
