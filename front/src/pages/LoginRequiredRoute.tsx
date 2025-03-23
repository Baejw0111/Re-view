import AuthError from "@/pages/AuthError";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function LoginRequiredRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSignedIn = useSelector((state: RootState) => state.isSignedIn);

  return isSignedIn ? <>{children}</> : <AuthError />;
}
