import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/shadcn-ui/form";
import { Input } from "@/shared/shadcn-ui/input";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { Badge } from "@/shared/shadcn-ui/badge";
import { X } from "lucide-react";
import { uploadReview } from "@/api/review";
import { useMutation } from "@tanstack/react-query";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(1, {
    message: "제목은 최소 한글자 이상이어야 합니다.",
  }),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "하나 이상의 이미지를 업로드해야 합니다.",
    })
    .refine((files) => files.length <= 5, {
      message: "최대 5개까지 업로드 가능합니다.",
    })
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `파일 크기는 5MB 이하여야 합니다.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "JPEG, PNG, WEBP 형식의 이미지만 허용됩니다."
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          /\.(jpg|jpeg|png|webp)$/i.test(file.name)
        ),
      "올바른 파일 확장자(.jpg, .jpeg, .png, .webp)를 가진 이미지만 허용됩니다."
    ),
  reviewText: z.string().min(1, {
    message: "리뷰 내용은 최소 한글자 이상이어야 합니다.",
  }),
  rating: z.number().nonnegative({
    message: "평점은 0 이상이어야 합니다.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "태그는 최소 1개 이상이어야 합니다.",
  }),
});

export default function ReviewForm() {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");

  // 폼 정의
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      images: undefined,
      reviewText: "",
      rating: 0,
      tags: [],
    },
  });

  // 리뷰 업로드
  const mutation = useMutation({
    mutationFn: uploadReview,
    onSuccess: () => {
      console.log("리뷰 업로드 성공");
      navigate("/");
    },
    onError: (error) => {
      console.error("리뷰 업로드 중 에러 발생:", error);
      alert("리뷰 업로드 중 에러가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 제출 시 실행될 작업
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 폼 값 처리
    console.log(values);
    const formData = new FormData();
    formData.append("author", "test");
    formData.append("uploadTime", new Date().toISOString());
    formData.append("title", values.title);
    formData.append("reviewText", values.reviewText);
    formData.append("rating", values.rating.toString());
    values.tags.forEach((tag) => formData.append("tags", tag));

    if (values.images) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
    }

    mutation.mutate(formData);
  };

  // 텍스트 입력 창에서 엔터 키 입력 시 제출 방지
  const handleEnterKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      e.target instanceof HTMLInputElement &&
      e.target.type !== "textarea"
    ) {
      e.preventDefault();
    }
  };

  // 태그 입력 처리
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // 태그 입력 시 추가
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      const newTags = tagInput
        .split("#")
        .filter((tag) => tag.trim() !== "")
        .map((tag) => tag.trim());
      form.setValue("tags", [...form.getValues("tags"), ...newTags]);
      setTagInput("");
    }
  };

  // 태그 삭제
  const handleDeleteTag = (index: number) => {
    const tags = form.getValues("tags");
    const newTags = tags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={handleEnterKeyDown}
          className="w-2/3 space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input placeholder="제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="reviewText"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="리뷰 내용" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(+e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="태그 입력"
                      {...field}
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </FormControl>
                  {form.getValues("tags").map((tag, index) => (
                    <Badge key={index} className="mr-1">
                      {tag}{" "}
                      <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleDeleteTag(index)}
                      />
                    </Badge>
                  ))}
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
