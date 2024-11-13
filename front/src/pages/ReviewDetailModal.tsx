import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setIsReviewDetailOpen } from "@/state/store/reviewDetailOpenSlice";
import { setIsNotificationOpen } from "@/state/store/notificationOpenSlice";
import { useMediaQuery } from "@/shared/hooks";
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
import ReviewDetail from "@/widgets/ReviewDetail";
import CommentInput from "@/features/interaction/CommentInput";
import CommentList from "@/widgets/CommentList";
import { Separator } from "@/shared/shadcn-ui/separator";
import { useLocation, useSearchParams } from "react-router-dom";

export default function ReviewDetailModal() {
  const dispatch = useDispatch();
  const [queryParams, setQueryParams] = useSearchParams();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md(768px) 아래의 너비는 모바일 환경으로 간주
  const isModalOpen = useSelector(
    (state: RootState) => state.reviewDetailOpen.isReviewDetailOpen
  );
  const isNotificationOpen = useSelector(
    (state: RootState) => state.notificationOpen.isNotificationOpen
  );

  const handleClose = () => {
    if (isModalOpen) {
      /**
       * 아래의 코드는 유저가 직접 UI를 조작해 isOpen을 false로 만들 때 작동한다.
       * 코드에 의해 isOpen이 false가 될 경우 아래의 코드는 동작하지 않는다.
       */
      dispatch(setIsReviewDetailOpen(false));
      // navigate(-1);
      queryParams.delete("reviewId");
      setQueryParams(queryParams);
    }
  };

  useEffect(() => {
    if (queryParams.get("reviewId") === null || pathname === "/edit") {
      dispatch(setIsReviewDetailOpen(false));
    } else {
      dispatch(setIsNotificationOpen(false));
      dispatch(setIsReviewDetailOpen(true));
    }
  }, [queryParams, pathname]);

  if (isDesktop === null) return;

  if (isDesktop) {
    return (
      <Dialog
        open={isModalOpen && !isNotificationOpen}
        onOpenChange={handleClose}
      >
        <DialogContent
          className="block md:max-w-[760px] lg:max-w-[860px] h-[90vh] p-20 overflow-y-auto scrollbar-hide focus-visible:outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            // 마우스 뒤로가기 버튼 또는 앞으로 가기 버튼 클릭 시 클릭 이벤트 방지
            if (
              e.detail.originalEvent.button === 3 ||
              e.detail.originalEvent.button === 4
            ) {
              e.preventDefault();
            }
          }}
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
    <Drawer open={isModalOpen && !isNotificationOpen} onClose={handleClose}>
      <DrawerContent
        className="h-[90vh] focus-visible:outline-none"
        onInteractOutside={handleClose}
      >
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
