import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { Input } from "@/shared/shadcn-ui/input";
import { ProfileFormValues } from "@/shared/types/interface";
import { UseFormReturn } from "react-hook-form";

export default function NicknameForm({
  form,
}: {
  form: UseFormReturn<ProfileFormValues>;
}) {
  return (
    <FormField
      control={form.control}
      name="newNickname"
      render={({ field }) => (
        <>
          <FormItem>
            <FormControl>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-bold">닉네임</div>
                <Input id="newNickname" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
