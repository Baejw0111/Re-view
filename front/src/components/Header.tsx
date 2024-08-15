import Logo from "@/components/Logo";
import Menu from "@/components/Menu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import ReviewModalButton from "./CreateReviewButton";

export default function Header() {
  return (
    <header className="fixed p-0 top-0 left-0 w-full h-16 bg-gray-600 text-white flex justify-around items-center">
      <Logo />
      <Menu />
      <div className="absolute right-4 w-20 flex justify-between">
        <ReviewModalButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
