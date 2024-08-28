import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setIsOpen } from "@/state/store/reviewDetailOpenSlice";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  // DialogTrigger,
} from "@/shared/shadcn-ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  // DrawerTrigger,
} from "@/shared/shadcn-ui/drawer";

function ReviewDetail() {
  return (
    <div>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl md:text-3xl font-bold">Review Detail</div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewDetailModal() {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isOpen = useSelector(
    (state: RootState) => state.reviewDetailOpen.isOpen
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={() => dispatch(setIsOpen(false))}>
        {/* <DialogTrigger asChild>{trigger}</DialogTrigger> */}
        <DialogContent className="max-w-[70vw] h-[90vh] py-10 px-10 overflow-y-auto">
          <DialogTitle hidden></DialogTitle>
          <DialogDescription hidden></DialogDescription>
          <ReviewDetail />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={() => dispatch(setIsOpen(false))}>
      {/* <DrawerTrigger asChild>{trigger}</DrawerTrigger> */}
      <DrawerContent className="h-[100vh]">
        <DrawerTitle hidden></DrawerTitle>
        <DrawerDescription hidden></DrawerDescription>
        <div className="py-10 px-10 overflow-y-auto scrollbar-hide">
          <ReviewDetail />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
