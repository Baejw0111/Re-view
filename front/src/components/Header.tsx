import Logo from "@/components/Logo";
import Menu from "@/components/Menu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CreateReviewButton from "@/components/CreateReviewButton";
import UserProfile from "@/components/UserProfile";
import NotificationButton from "@/components/NotificationButton";
import KakaoLoginButton from "@/components/KakaoLoginButton";
import KakaoLogoutButton from "@/components/KakaoLogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

export default function Header() {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  return (
    <header className="fixed p-0 top-0 left-0 w-full h-16 bg-gray-600 text-white flex justify-around items-center z-50">
      <Logo />
      <Menu />
      <UserProfile />
      <div className="absolute right-4 w-48 flex justify-between">
        <ThemeToggle />
        {userInfo.nickname ? (
          // 닉네임이 있으면 유저가 사용 가능한 버튼 보여주기
          <>
            <CreateReviewButton />
            <NotificationButton />
            <KakaoLogoutButton />
          </>
        ) : (
          // 닉네임이 없으면 로그인 버튼 보여주기
          <KakaoLoginButton />
        )}
      </div>
    </header>
  );
}
