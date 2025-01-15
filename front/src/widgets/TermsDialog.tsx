import TermsOfUse from "@/features/common/TermsOfUse";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/shared/shadcn-ui/dialog";
import { Button } from "@/shared/shadcn-ui/button";

export default function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm text-blue-500"
        >
          이용약관
        </Button>
      </DialogTrigger>
      <DialogContent className="block md:max-w-[760px] lg:max-w-[860px] h-[90vh] p-20 overflow-y-auto scrollbar-hide focus-visible:outline-none">
        <DialogTitle className="text-4xl">이용약관</DialogTitle>
        <DialogDescription hidden />
        <TermsOfUse />
      </DialogContent>
    </Dialog>
  );
}
