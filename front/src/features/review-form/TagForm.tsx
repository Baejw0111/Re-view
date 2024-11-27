import { useState } from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { ReviewFormValues } from "@/shared/types/interface";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/shared/shadcn-ui/input";
import { Button } from "@/shared/shadcn-ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/shadcn-ui/popover";
import { Badge } from "@/shared/shadcn-ui/badge";
import { Info, X } from "lucide-react";

export default function TagForm({
  form,
}: {
  form: UseFormReturn<ReviewFormValues>;
}) {
  const [tagInput, setTagInput] = useState(""); // 태그 입력 상태

  /**
   * 태그 입력 처리
   */
  const handleTagInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTagInput(e.target.value);
  };

  /**
   * 태그 입력 시 추가
   */
  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      const newTags = tagInput.trim().toLowerCase();

      // 중복 태그 제외
      if (!form.getValues("tags").includes(newTags)) {
        form.setValue("tags", [...form.getValues("tags"), newTags]);
      }

      setTagInput("");
    }
  };

  /**
   * 태그 삭제
   * @param {number} index - 태그 인덱스
   * @returns {void}
   */
  const handleDeleteTag = (index: number): void => {
    const tags = form.getValues("tags");
    const newTags = tags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <>
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-2">
                <Input
                  className="w-full md:w-1/2"
                  placeholder="입력 후 엔터를 눌러 태그 생성"
                  {...field}
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      className=" shrink-0"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    className="w-60 text-xs text-muted-foreground break-keep"
                  >
                    <p>
                      {`태그는 다른 유저들이 작성한 리뷰를 시스템에서 쉽게 찾고 분류할 수 있도록 도와줍니다.`}
                    </p>
                    <br />
                    <p>{`올바른 태그들을 사용하여 리뷰를 작성해주세요.`}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <div className="flex flex-wrap items-start gap-1.5">
              {form.getValues("tags").map((tag, index) => (
                <Badge key={index} className="px-2 gap-2">
                  {tag}
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleDeleteTag(index)}
                    role="button"
                  />
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
