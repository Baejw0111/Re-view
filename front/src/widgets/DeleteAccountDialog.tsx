import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/shadcn-ui/alert-dialog";
import { Button } from "@/shared/shadcn-ui/button";
import { deleteUserAccount } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/shared/shadcn-ui/input";

export default function DeleteAccountDialog() {
  const [inputValue, setInputValue] = useState("");
  const { mutate: deleteUserAccountMutation } = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      window.location.href = `/`;
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-destructive font-semibold" variant="outline">
          계정 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md flex flex-col gap-6">
        <AlertDialogHeader className="flex flex-col gap-4">
          <AlertDialogTitle className="text-destructive font-semibold">
            계정 삭제
          </AlertDialogTitle>
          <AlertDialogDescription>
            서비스에서 탈퇴하면 모든 데이터는 삭제되며 복구가 불가능합니다.
            서비스에서 탈퇴하려면 아래의 입력 칸에 "계정 삭제"를 입력 후 삭제
            버튼을 눌러주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground font-semibold"
            onClick={() => deleteUserAccountMutation()}
            disabled={inputValue !== "계정 삭제"}
          >
            계정 삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
