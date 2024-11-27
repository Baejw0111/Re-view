import { Skeleton } from "@/shared/shadcn-ui/skeleton";
import { LoaderCircle } from "lucide-react";

export default function LoadingBox() {
  return (
    <Skeleton className="aspect-square rounded-md text-muted-foreground flex items-center justify-center">
      <LoaderCircle className="w-6 h-6 animate-spin" />
    </Skeleton>
  );
}
