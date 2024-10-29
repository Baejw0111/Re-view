import { Card } from "@/shared/shadcn-ui/card";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/shared/shadcn-ui/resizable";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";

export default function SkeletonReviewCard() {
  return (
    <Card className="overflow-hidden shadow-lg transition-shadow h-60 relative hover:shadow-xl active:shadow-xl">
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
              <div className="flex items-center justify-start">
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-1/2" />
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
