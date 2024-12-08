import { Card } from "@/shared/shadcn-ui/card";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";

export default function SkeletonUserCard({
  isUserProfile,
}: {
  isUserProfile?: boolean;
}) {
  return (
    <div>
      <Card
        className={`flex flex-col justify-center items-center gap-4 p-8 max-w-xl mx-auto ${
          isUserProfile ? "" : "h-48"
        }`}
      >
        <div className="flex flex-row w-full items-center gap-6">
          <div className="flex-1 flex justify-center items-center">
            <Skeleton
              className={`h-24 w-24 rounded-full ${
                isUserProfile ? "h-36 w-36" : ""
              }`}
            />
          </div>
          <div className="flex-1 flex flex-col gap-6 items-start">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
        {isUserProfile && <Skeleton className="h-6 w-1/2" />}
      </Card>
    </div>
  );
}
