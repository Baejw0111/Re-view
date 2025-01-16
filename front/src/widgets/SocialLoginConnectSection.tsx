import { SocialLoginConnector } from "@/features/setting/SocialLoginConnector";
import { useQuery } from "@tanstack/react-query";
import { getSocialProvidersInfo } from "@/api/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export function SocialLoginConnectSection() {
  const aliasId = useSelector((state: RootState) => state.userInfo.aliasId);
  const socialAccounts = [
    {
      provider: "google",
      name: "Google",
      color: "bg-[#FFFFFF]",
    },
    {
      provider: "kakao",
      name: "카카오",
      color: "bg-[#FEE500]",
    },
    {
      provider: "naver",
      name: "네이버",
      color: "bg-[#03C75A]",
    },
  ];
  const { data: socialProvidersInfo } = useQuery({
    queryKey: ["socialProvidersInfo"],
    queryFn: () => getSocialProvidersInfo(),
    enabled: aliasId !== "",
  });

  return (
    <div className="grid gap-6">
      <>
        {socialProvidersInfo &&
          socialAccounts.map((account) => (
            <SocialLoginConnector
              key={account.provider}
              provider={account.provider}
              name={account.name}
              color={account.color}
              isConnected={socialProvidersInfo[account.provider]}
            />
          ))}
      </>
    </div>
  );
}
