import Logo from "@/features/common/Logo";
import ThemeToggleButton from "@/features/setting/ThemeToggleButton";
import UserProfile from "@/features/user/UserProfile";
import NotificationButton from "@/features/user/NotificationButton";
import KakaoLoginButton from "@/features/auth/KakaoLoginButton";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store/index";
import { Link } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import SearchBar from "@/features/common/SearchBar";

export default function Header() {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  if (window.location.pathname === "/onboarding") return null;

  return (
    <header
      className="sticky p-0 top-0 left-0 w-full h-16 backdrop-blur-xl
      text-slate-700 dark:text-slate-200 flex justify-around items-center z-50 supports-[backdrop-filter]:bg-background/40"
    >
      <div className="container px-4 md:px-6 max-w-screen-2xl flex justify-between items-center gap-5">
        <Link to="/feed">
          <Logo />
        </Link>
        <div className="flex flex-1 md:justify-end items-center gap-2">
          <SearchBar />
          <ThemeToggleButton />
          {userInfo.nickname ? (
            // 닉네임이 있으면(로그인을 했을 경우) 유저가 사용 가능한 버튼 보여주기
            <>
              <NotificationButton />
              <Button variant="ghost" className="h-9 w-9 rounded-full">
                <Link to={`/profile/${userInfo.kakaoId}`}>
                  <UserProfile
                    className="h-7 w-7"
                    profileImage={userInfo.profileImage}
                    nickname={userInfo.nickname}
                  />
                </Link>
              </Button>
            </>
          ) : (
            // 닉네임이 없으면 로그인 버튼 보여주기
            <KakaoLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
