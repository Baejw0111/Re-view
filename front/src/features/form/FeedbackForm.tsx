import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendUserFeedback } from "@/api/user";
import { toast } from "sonner";
import { Button } from "@/shared/shadcn-ui/button";
import { Textarea } from "@/shared/shadcn-ui/textarea";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");

  const sendFeedbackMutation = useMutation({
    mutationFn: () => sendUserFeedback(feedback),
    onSuccess: () => {
      toast.success("피드백이 전송되었습니다.");
      setFeedback("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 제출 버튼 클릭 시 발생하는 새로고침 방지

    if (feedback.trim()) {
      await sendFeedbackMutation.mutateAsync();
      setFeedback("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        placeholder="피드백을 입력해주세요."
        value={feedback}
        rows={5}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <p
        className="text-[0.8rem] font-medium text-destructive"
        hidden={feedback.length <= 2000}
      >
        최대 2000자까지 입력 가능합니다.
      </p>
      <Button
        type="submit"
        disabled={feedback.length === 0 || feedback.length > 2000}
      >
        제출
      </Button>
    </form>
  );
}
