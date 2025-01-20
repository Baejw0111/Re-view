import { useState, useRef, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { ReviewFormValues } from "@/shared/types/interface";
import { UseFormReturn } from "react-hook-form";
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
  const currentTags = form.watch("tags"); // 현재 태그 상태
  const [tagInput, setTagInput] = useState(""); // 태그 입력 상태
  const tagInputRef = useRef<HTMLInputElement>(null);

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
      e.preventDefault();
      const newTags = tagInput.trim().toLowerCase();

      // 중복 태그 제외
      if (!currentTags.includes(newTags)) {
        form.setValue("tags", [...currentTags, newTags]);
      }

      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && currentTags.length > 0) {
      e.preventDefault();
      const newTags = [...currentTags];
      newTags.pop();
      form.setValue("tags", newTags);
    }
  };

  /**
   * 태그 삭제
   * @param {number} index - 태그 인덱스
   * @returns {void}
   */
  const handleDeleteTag = (index: number): void => {
    const newTags = currentTags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  useEffect(() => {
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [currentTags]);

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <>
          <FormItem className="space-y-0 flex flex-col gap-2">
            <div className="flex items-center justify-start gap-0">
              <div className="text-lg font-bold">태그(최대 5개)</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    className="shrink-0 rounded-full"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-60 text-xs text-muted-foreground break-keep"
                >
                  <p>
                    Enter를 눌러 태그를 추가하세요. Backspace를 눌러 마지막
                    태그를 삭제할 수 있습니다.
                  </p>
                  <br />
                  <p>
                    태그는 다른 유저들이 작성한 리뷰를 시스템에서 쉽게 찾고
                    분류할 수 있도록 도와줍니다.
                  </p>
                  <br />
                  <p>이미 입력한 태그를 입력할 경우 자동으로 삭제됩니다.</p>
                  <br />
                  <p>올바른 태그들을 사용하여 리뷰를 작성해주세요.</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full flex flex-wrap items-start gap-1.5">
              {currentTags.map((tag, index) => (
                <Badge key={index} className="px-2 gap-2">
                  {tag}
                  <button type="button" onClick={() => handleDeleteTag(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
              <FormControl>
                <input
                  className="flex-grow outline-none bg-transparent text-sm"
                  placeholder={
                    currentTags.length === 0
                      ? `상단의 ⓘ 버튼을 눌러보세요.`
                      : ""
                  }
                  {...field}
                  ref={tagInputRef}
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
