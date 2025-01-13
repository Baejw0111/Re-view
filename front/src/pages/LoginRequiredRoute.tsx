import AuthError from "@/pages/AuthError";
import { useAuth } from "@/shared/hooks";

export default function LoginRequiredRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useAuth();

  return isAuth ? <>{children}</> : <AuthError />;
}
