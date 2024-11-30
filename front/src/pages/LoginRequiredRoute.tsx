import AuthError from "@/pages/AuthError";

export default function LoginRequiredRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = sessionStorage.getItem("isAuth") === "true";

  return isAuth ? <>{children}</> : <AuthError />;
}
