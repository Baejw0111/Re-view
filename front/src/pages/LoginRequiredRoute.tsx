import AuthError from "@/pages/AuthError";

export default function LoginRequiredRoute({
  children,
  isAuth,
}: {
  children: React.ReactNode;
  isAuth: boolean;
}) {
  return isAuth ? <>{children}</> : <AuthError />;
}
