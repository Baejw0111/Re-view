import { TabsContent } from "@/shared/shadcn-ui/tabs";
import { Link, useParams, useLoaderData } from "react-router-dom";
import { claculateTime } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CommentInfo } from "@/shared/types/interface";

export default function CommentsTab() {
  const { userId } = useParams();
  const initialData = useLoaderData() as CommentInfo[];

  // 사용자가 작성한 댓글 가져오기
  const { data: userCommentList } = useQuery<CommentInfo[]>({
    queryKey: ["userCommentList", userId],
    initialData: initialData,
  });

  return (
    <TabsContent value="comments" className="mt-6 max-w-xl mx-auto">
      <div className="bg-background rounded-lg">
        {userCommentList &&
          userCommentList.map((commentInfo, index) => (
            <div
              key={index}
              className="border-b last:border-b-0 p-4 flex justify-between"
            >
              <Link
                to={`?reviewId=${commentInfo.reviewId}#${commentInfo._id}`}
                className="hover:underline text-sm whitespace-pre-wrap break-all"
              >
                {commentInfo.content}
              </Link>
              <span className="text-xs text-muted-foreground">
                {claculateTime(commentInfo.uploadTime)}
              </span>
            </div>
          ))}
      </div>
    </TabsContent>
  );
}
