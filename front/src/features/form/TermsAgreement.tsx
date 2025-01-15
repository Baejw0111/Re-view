import { Checkbox } from "@/shared/shadcn-ui/checkbox";
import { Label } from "@/shared/shadcn-ui/label";
import TermsDialog from "@/widgets/TermsDialog";
import PrivacyAgreementDialog from "@/widgets/PrivacyAgreementDialog";

export default function TermsAgreement({
  isAgreementChecked,
  setIsAgreementChecked,
}: {
  isAgreementChecked: boolean;
  setIsAgreementChecked: (isAgreementChecked: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <Checkbox
          id="agreement"
          checked={isAgreementChecked}
          onCheckedChange={() => setIsAgreementChecked(!isAgreementChecked)}
        />
        <Label htmlFor="agreement" className="font-medium">
          모든 필수 약관에 동의합니다
        </Label>
      </div>
      <div className="w-full text-sm text-muted-foreground">
        <TermsDialog />및
        <PrivacyAgreementDialog />에 동의합니다.
      </div>
    </>
  );
}
