import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { Input } from "@/shared/shadcn-ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormValues } from "@/shared/types/interface";

export default function TitleForm({
  form,
}: {
  form: UseFormReturn<ReviewFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <>
          <FormItem>
            <FormControl>
              <Input
                className="w-full"
                id="title"
                placeholder="제목(최대 20자)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
