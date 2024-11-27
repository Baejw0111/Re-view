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
              <div className="grid gap-2">
                <Textarea
                  id="review"
                  placeholder="리뷰를 작성해주세요.(최대 1000자)"
                  rows={10}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
