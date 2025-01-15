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

/**
 * 알림창을 띄우는 컴포넌트
 * @param children 알림창을 띄우는 버튼
 * @param title 알림창 제목
 * @param description 알림창 내용
 * @param onConfirm 확인 버튼 클릭 시 실행되는 함수
 * @returns
 */

export default function Alert({
  children,
  title,
  description,
  onConfirm,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md flex flex-col gap-6">
        <AlertDialogHeader className="flex flex-col gap-4">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive" onClick={onConfirm}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
