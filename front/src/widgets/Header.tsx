import Logo from "@/features/common/Logo";
import NotificationButton from "@/widgets/NotificationButton";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store/index";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "@/features/common/SearchBar";
import WriteReviewButton from "@/features/review/WriteReviewButton";
import { useMediaQuery, useScrollDirection } from "@/shared/hooks";
import ProfileButton from "@/features/user/ProfileButton";
import { Button } from "@/shared/shadcn-ui/button";
import { Search, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsSearchDialogOpen } from "@/state/store/searchDialogOpenSlice";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const isScrollingUp = useScrollDirection();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const onOpenSearchDialog = () => {
    dispatch(setIsSearchDialogOpen(true));
  };

  const handleNotificationButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (userInfo.socialId === "") {
      e.preventDefault();
      toast.error("로그인 후 이용해주세요.");
      navigate("/login");

      return;
    }
  };

  return (
    <>
      {window.location.pathname !== "/onboarding" &&
        window.location.pathname !== "/login" &&
        (isMobile ? (
          <nav
            className={`fixed p-0 bottom-0 left-0 w-full h-14 bg-background
      flex justify-around items-center z-50 transition-all duration-300 ease-in-out ${
        isScrollingUp ? "translate-y-0" : "translate-y-full"
      }`}
          >
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link to="/">
                <Logo className="h-7 w-7" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={onOpenSearchDialog}
            >
              <Search />
            </Button>
            <WriteReviewButton />
            <Button
              onClick={handleNotificationButtonClick}
              variant="ghost"
              size="icon"
              className="shrink-0"
              asChild
            >
              <Link to="/notifications">
                <Bell />
              </Link>
            </Button>
            <ProfileButton userInfo={userInfo} />
          </nav>
        ) : (
          <header
            className={`sticky p-0 top-0 left-0 w-full h-16 bg-background
      flex justify-around items-center z-50 transition-all duration-300 ease-in-out ${
        isScrollingUp ? "translate-y-0" : "-translate-y-full"
      }`}
          >
            <div className="container px-4 md:px-6 max-w-screen-2xl flex justify-between items-center gap-5">
              <Link to="/">
                <Logo />
              </Link>
              <div className="flex flex-1 md:justify-end items-center gap-2">
                <SearchBar />
                {userInfo.socialId !== "" && (
                  // 로그인을 했을 경우 유저가 사용 가능한 버튼 보여주기
                  <>
                    <WriteReviewButton />
                    <NotificationButton />
                  </>
                )}
                <ProfileButton userInfo={userInfo} />
              </div>
            </div>
          </header>
        ))}
    </>
  );
}
