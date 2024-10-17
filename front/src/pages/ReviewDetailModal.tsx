import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setIsOpen } from "@/state/store/reviewDetailOpenSlice";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/shadcn-ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/shared/shadcn-ui/drawer";
import { useNavigate } from "react-router-dom";
import ReviewDetail from "@/widgets/ReviewDetail";
import CommentInput from "@/features/interaction/CommentInput";
import CommentList from "@/widgets/CommentList";
import { Separator } from "@/shared/shadcn-ui/separator";
import { useLocation } from "react-router-dom";

export default function ReviewDetailModal() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md(768px) 아래의 너비는 모바일 환경으로 간주
  const isOpen = useSelector(
    (state: RootState) => state.reviewDetailOpen.isOpen
  );
  const navigate = useNavigate();

  const handleClose = () => {
    if (isOpen) {
      /**
       * 아래의 코드는 유저가 직접 UI를 조작해 isOpen을 false로 만들 때 작동한다.
       * 코드에 의해 isOpen이 false가 될 경우 아래의 코드는 동작하지 않는다.
       */
      dispatch(setIsOpen(false));
      navigate(-1);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("reviewId") === null) {
      dispatch(setIsOpen(false));
    }
  }, [location.search, dispatch]);

  if (isDesktop === null) return;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="block md:max-w-[760px] lg:max-w-[860px] h-[90vh] p-20 overflow-y-auto scrollbar-hide"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle hidden></DialogTitle>
          <DialogDescription hidden></DialogDescription>
          <ReviewDetail />
          <Separator className="my-4" />
          <CommentInput />
          <CommentList />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent className="h-[90vh]">
        <DrawerTitle hidden></DrawerTitle>
        <DrawerDescription hidden></DrawerDescription>
        <div className="p-5 pb-20 overflow-y-auto scrollbar-hide">
          <ReviewDetail />
          <Separator className="my-4" />
          <CommentList />
          <CommentInput />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
