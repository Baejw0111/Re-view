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
  isEditing,
}: {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
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
                {isEditing ? (
                  <>
                    <div className="text-sm font-bold">닉네임</div>
                    <Input id="newNickname" {...field} />
                  </>
                ) : (
                  <h2 className="text-2xl text-center font-semibold">
                    {field.value}
                  </h2>
                )}
              </div>
            </FormControl>
            {isEditing && <FormMessage />}
          </FormItem>
        </>
      )}
    />
  );
}
