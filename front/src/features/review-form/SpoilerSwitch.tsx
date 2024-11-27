import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/shared/shadcn-ui/form";
import { Switch } from "@/shared/shadcn-ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormValues } from "@/shared/types/interface";

export default function SpoilerSwitch({
  form,
}: {
  form: UseFormReturn<ReviewFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="isSpoiler"
      render={({ field }) => (
        <>
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Switch
                  id="isSpoiler"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="isSpoiler">스포일러</FormLabel>
            </div>
          </FormItem>
        </>
      )}
    />
  );
}
