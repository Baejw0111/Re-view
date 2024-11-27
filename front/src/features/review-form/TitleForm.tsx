import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormValues } from "@/shared/types/interface";
import { Input } from "@/shared/shadcn-ui/input";

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
                className="w-full h-9 px-1 py-0 border-0 outline-none focus-visible:ring-0 text-3xl font-bold bg-transparent"
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
