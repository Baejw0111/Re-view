import { FormField, FormItem, FormControl } from "@/shared/shadcn-ui/form";
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
                  className="data-[state=checked]:bg-destructive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="text-sm font-bold text-destructive">스포일러</div>
            </div>
          </FormItem>
        </>
      )}
    />
  );
}
