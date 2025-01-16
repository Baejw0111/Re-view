import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormValues } from "@/shared/types/interface";

export default function ReviewTextForm({
  form,
}: {
  form: UseFormReturn<ReviewFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="reviewText"
      render={({ field }) => (
        <>
          <FormItem>
            <FormControl>
              <Textarea
                id="review"
                placeholder="리뷰를 작성해주세요.(최대 2000자)"
                rows={5}
                {...field}
                className="py-0 px-1 rounded-none border-0 focus-visible:ring-0 resize-none"
                style={{ overflow: "hidden" }} // 자동 높이 조정 및 스크롤 숨기기
                onInput={(e) => {
                  e.currentTarget.style.height = "auto"; // 높이 초기화
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // 내용에 맞게 높이 조정
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
