import AuthError from "@/pages/AuthError";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function LoginRequiredRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  return userInfo.aliasId ? <>{children}</> : <AuthError />;
}
