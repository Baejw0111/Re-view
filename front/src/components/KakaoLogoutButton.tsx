import { Button } from "@/components/ui/button";
import { logOutKakao } from "@/util/api";
import { LogOutIcon } from "lucide-react";

export default function KakaoLogoutButton() {
  const handleLogOut = async () => {
    await logOutKakao();
    window.location.href = "/";
  };

  return (
    <Button size="icon" onClick={handleLogOut}>
      <LogOutIcon />
    </Button>
  );
}
