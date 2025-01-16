import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteSocialProvider } from "@/api/auth";
import { authUrlVariants } from "@/shared/constants";
import { Switch } from "@/shared/shadcn-ui/switch";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function SocialLoginConnector({
  provider,
  name,
  color,
  isConnected,
}: {
  provider: string;
  name: string;
  color: string;
  isConnected: boolean;
}) {
  const [connected, setConnected] = useState(isConnected);

  const deleteMutation = useMutation({
    mutationFn: () => deleteSocialProvider(provider),
    onSuccess: () => {
      setConnected(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("소셜 로그인 연동 해제 중 오류가 발생:", {
        description: error.response?.data.message,
      });
    },
  });

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      window.location.href = `${authUrlVariants[provider]}&redirect_uri=${window.location.origin}/oauth/${provider}/add`;
    } else {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="flex flex-row justify-between rounded-xl border bg-card text-card-foreground shadow p-4">
      <div className="flex flex-row items-center gap-x-2">
        <div
          className={`h-6 w-6 shrink-0 rounded-md flex items-center justify-center ${color}`}
        >
          <img
            src={`/${provider}-symbol.svg`}
            alt={provider}
            className="h-4 w-4 shrink-0"
          />
        </div>
        <span>{name}</span>
      </div>
      <div className="flex items-center">
        <Switch
          className="data-[state=checked]:bg-green-500"
          id={provider}
          checked={connected}
          onCheckedChange={handleToggle}
          disabled
        />
      </div>
    </div>
  );
}
