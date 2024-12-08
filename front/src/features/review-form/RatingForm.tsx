import { useState } from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/shared/shadcn-ui/select";
import ReviewRatingSign from "../review/ReviewRatingSign";
import { ReviewFormValues } from "@/shared/types/interface";
import { UseFormReturn } from "react-hook-form";

export default function RatingForm({
  form,
  defaultValue,
}: {
  form: UseFormReturn<ReviewFormValues>;
  defaultValue?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="rating"
      render={({ field }) => (
        <>
          <FormItem>
            <FormControl>
              <Select
                onValueChange={(value) => field.onChange(+value)}
                defaultValue={defaultValue?.toString()}
                onOpenChange={setIsOpen}
              >
                <SelectTrigger
                  className={`w-16 h-10 px-1 rounded-none border-0 border-b-2 focus:border-b-foreground focus:ring-0 outline-none transition-all duration-300 ease-in-out
                    ${isOpen ? "border-b-foreground" : ""}
                    `}
                >
                  <SelectValue placeholder="평점" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 11 }, (_, index) => (
                      <SelectItem key={index} value={(index * 0.5).toString()}>
                        <ReviewRatingSign rating={index * 0.5} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
