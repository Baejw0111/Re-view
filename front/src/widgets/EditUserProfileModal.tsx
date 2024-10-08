import { Button } from "@/shared/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/shared/shadcn-ui/dialog";
import EditUserProfile from "@/features/setting/EditUserProfile";

export default function EditUserProfileModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-w-32 mx-auto md:mx-0"
        >
          프로필 편집
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        <DialogDescription hidden></DialogDescription>
        <EditUserProfile
          submitFooter={
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">저장</Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
