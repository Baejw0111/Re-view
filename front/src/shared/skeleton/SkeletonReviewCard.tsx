import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/shared/shadcn-ui/resizable";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";
import { Separator } from "@/shared/shadcn-ui/separator";

export default function SkeletonReviewCard() {
  return (
    <Card className="overflow-hidden shadow-lg transition-shadow aspect-[1.618] relative hover:shadow-xl active:shadow-xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={55} collapsible={true}>
          <div className="p-4 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div role="button" className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-8 rounded-sm" />
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex gap-1.5 w-full">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Separator className="my-3" />
              <div className="flex gap-6">
                <Skeleton className="rounded-full h-5 w-5" />
                <Skeleton className="rounded-full h-5 w-5" />
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Skeleton className="w-full h-full rounded-none" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
