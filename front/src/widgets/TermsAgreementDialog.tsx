import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/shared/shadcn-ui/dialog";
import TermsAgreement from "@/features/form/TermsAgreement";
import { Button } from "@/shared/shadcn-ui/button";
import { updateTermsAgreement } from "@/api/auth";

export default function TermsAgreementDialog({ open }: { open: boolean }) {
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">약관 동의</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          약관이 업데이트 되었습니다. 원활한 서비스 이용을 위해 약관에 동의해
          주세요.
        </DialogDescription>
        <TermsAgreement
          isAgreementChecked={isAgreementChecked}
          setIsAgreementChecked={setIsAgreementChecked}
        />
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              updateTermsAgreement();
              window.location.reload();
            }}
            disabled={!isAgreementChecked}
          >
            동의하고 계속하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
