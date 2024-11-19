import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadReview, editReview } from "@/api/review";
import { Button } from "@/shared/shadcn-ui/button";
import { Input } from "@/shared/shadcn-ui/input";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { Badge } from "@/shared/shadcn-ui/badge";
import { Label } from "@/shared/shadcn-ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/shared/shadcn-ui/form";
import { Card } from "@/shared/shadcn-ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/shadcn-ui/select";
import { Skeleton } from "@/shared/shadcn-ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/shadcn-ui/popover";
import { X, Plus, Info } from "lucide-react";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { ReviewInfo } from "@/shared/types/interface";
import {
  API_URL,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "@/shared/constants";
import { handleEnterKeyDown, createPreviewImages } from "@/shared/lib/utils";
import { Switch } from "@/shared/shadcn-ui/switch";

export default function ReviewForm({
  reviewInfo,
}: {
  reviewInfo?: ReviewInfo;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState(""); // 태그 입력 상태
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기 이미지
  const [initialImages, setInitialImages] = useState<string[]>([]); // 초기 이미지
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 삭제할 이미지

  const formSchema = z.object({
    title: z
      .string()
      .min(1, {
        message: "제목을 입력해주세요.",
      })
      .max(20, {
        message: "제목은 최대 20자까지 입력할 수 있습니다.",
      }),
    images: z
      .instanceof(FileList)
      .refine((files) => files.length + initialImages.length > 0, {
        message: "하나 이상의 이미지를 업로드해야 합니다.",
      })
      .refine((files) => files.length + initialImages.length <= 5, {
        message: "이미지 파일은 최대 5개까지 업로드 가능합니다.",
      })
      .refine(
        (files) =>
          Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
        `파일 크기는 5MB 이하여야 합니다.`
      )
      .refine(
        // 이미지 MIME 타입 검증
        (files) =>
          Array.from(files).every((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type)
          ),
        "JPEG, PNG, WEBP 형식의 이미지만 허용됩니다."
      )
      .refine(
        // 이미지 확장자 검증
        (files) =>
          Array.from(files).every((file) =>
            /\.(jpg|jpeg|png|webp)$/i.test(file.name)
          ),
        "올바른 파일 확장자(.jpg, .jpeg, .png, .webp)를 가진 이미지만 허용됩니다."
      ),
    reviewText: z
      .string()
      .min(1, {
        message: "리뷰 내용을 입력해주세요.",
      })
      .max(1000, {
        message: "리뷰 내용은 최대 1000자까지 입력할 수 있습니다.",
      }),
    rating: z.number().nonnegative({
      message: "평점을 입력해주세요.",
    }),
    tags: z
      .array(z.string())
      .min(1, {
        message: "태그는 최소 1개 이상이어야 합니다.",
      })
      .max(5, {
        message: "태그는 최대 5개까지 입력할 수 있습니다.",
      }),
    isSpoiler: z.boolean(),
  });

  // 폼 정의
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      images: new DataTransfer().files, // 이미지 업로드 시 빈 배열로 초기화
      reviewText: "",
      rating: -1,
      tags: [],
      isSpoiler: false,
    },
  });

  useEffect(() => {
    if (reviewInfo) {
      form.setValue("title", reviewInfo.title);
      form.setValue("reviewText", reviewInfo.reviewText);
      form.setValue("rating", reviewInfo.rating);
      form.setValue("tags", reviewInfo.tags);
      form.setValue("isSpoiler", reviewInfo.isSpoiler);
      setInitialImages(reviewInfo.images);
    }
  }, [reviewInfo, form]);

  // 리뷰 업로드
  const { mutate: uploadReviewMutation } = useMutation({
    mutationFn: uploadReview,
    onSuccess: () => {
      // window.location.href = "/";
    },
    onError: () => {
      alert(
        "리뷰 업로드 중 에러가 발생했습니다.\n입력된 내용에 문제가 없는지 확인해주세요."
      );
    },
  });

  // 리뷰 수정
  const { mutate: editReviewMutation } = useMutation({
    mutationFn: (formData: FormData) =>
      editReview(reviewInfo?._id as string, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewInfo", reviewInfo?._id],
      });
      navigate(-1);
    },
    onError: () => {
      alert(
        "리뷰 수정 중 에러가 발생했습니다.\n입력된 내용에 문제가 없는지 확인해주세요."
      );
    },
  });

  // 업로드 제출 시 실행될 작업
  const onUploadSubmit = async (values: z.infer<typeof formSchema>) => {
    // 폼 값 처리
    const { title, reviewText, rating, tags, images, isSpoiler } = values;

    const formData = new FormData();
    formData.append("uploadTime", new Date().toISOString());
    formData.append("title", title);
    formData.append("reviewText", reviewText);
    formData.append("rating", rating.toString());
    tags.forEach((tag) => formData.append("tags", tag));
    [...images].forEach((image) => formData.append("images", image));
    formData.append("isSpoiler", isSpoiler.toString());

    uploadReviewMutation(formData);
  };

  // 수정 제출 시 실행될 작업
  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    // 폼 값 처리
    const { title, reviewText, rating, tags, images } = values;

    const formData = new FormData();
    if (reviewInfo?.title !== title) {
      formData.append("title", title);
    }
    if (reviewInfo?.reviewText !== reviewText) {
      formData.append("reviewText", reviewText);
    }
    if (reviewInfo?.rating !== rating) {
      formData.append("rating", rating.toString());
    }

    // 현재 태그 목록이 이전 태그 목록과 서로 같은지 확인
    const sortedNewTags = tags.sort();
    const sortedOldTags = reviewInfo?.tags.sort();

    if (sortedNewTags.join(",") !== sortedOldTags?.join(",")) {
      tags.forEach((tag) => formData.append("tags[]", tag));
    }

    // 이미지 업데이트
    deletedImages.forEach((image) => formData.append("deletedImages[]", image));
    [...images].forEach((image) => formData.append("images", image));

    editReviewMutation(formData);
  };

  // 태그 입력 처리
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // 태그 입력 시 추가
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      const newTags = tagInput.trim().toLowerCase();

      // 중복 태그 제외
      if (!form.getValues("tags").includes(newTags)) {
        form.setValue("tags", [...form.getValues("tags"), newTags]);
      }

      setTagInput("");
    }
  };

  // 태그 삭제
  const handleDeleteTag = (index: number) => {
    const tags = form.getValues("tags");
    const newTags = tags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  // 파일 목록 업데이트 함수
  const updateFileList = (newFiles: FileList, currentFiles: FileList) => {
    const updatedFiles = new DataTransfer();
    Array.from(currentFiles).forEach((file) => updatedFiles.items.add(file));
    Array.from(newFiles).forEach((file) => updatedFiles.items.add(file));
    return updatedFiles.files;
  };

  // 메인 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      const currentPreviewImages = [...previewImages]; // 현재 미리보기 이미지 상태

      // 스켈레톤 표시
      setPreviewImages([...previewImages, ...Array(newFiles.length).fill("")]);

      const currentFiles = form.getValues("images") || []; // 현재 업로드된 파일 목록
      const combinedFiles = updateFileList(newFiles, currentFiles); // 새로운 파일 목록과 현재 업로드된 파일 목록을 합친 파일 목록
      form.setValue("images", combinedFiles); // 폼 값 업데이트

      const newPreviewImages = await createPreviewImages(newFiles); // 미리보기 이미지 생성

      setPreviewImages([...currentPreviewImages, ...newPreviewImages]); // 미리보기 이미지 업데이트
    }
  };

  // 초기 이미지 제거 핸들러
  const handleRemoveInitialImage = (index: number) => {
    setDeletedImages([...deletedImages, initialImages[index]]);
    const newInitialImages = initialImages.filter((_, i) => i !== index);
    setInitialImages(newInitialImages);
  };

  // 사용자가 현재 업로드한 이미지 제거 핸들러
  const handleRemoveUploadedImage = (index: number) => {
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviewImages);

    const currentFiles = form.getValues("images");
    if (currentFiles) {
      const dataTransfer = new DataTransfer(); // 파일 목록을 담을 DataTransfer 객체 생성

      // 현재 업로드된 파일 목록에서 삭제할 파일을 제외한 새로운 파일 목록 생성
      Array.from(currentFiles)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      form.setValue("images", dataTransfer.files);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            reviewInfo ? onEditSubmit : onUploadSubmit
          )}
          onKeyDown={handleEnterKeyDown}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormControl>
                      <Select
                        key={reviewInfo ? reviewInfo._id : "default"}
                        onValueChange={(value) => field.onChange(+value)}
                        defaultValue={reviewInfo?.rating.toString()}
                      >
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="평점" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from({ length: 11 }, (_, index) => (
                              <SelectItem
                                key={index}
                                value={(index * 0.5).toString()}
                              >
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
          </div>
          <FormField
            control={form.control}
            name="reviewText"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Textarea
                        id="review"
                        placeholder="리뷰를 작성해주세요.(최대 1000자)"
                        rows={10}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <>
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-4 border border-muted rounded-md p-4">
                      <div className="flex flex-col gap-2 text-sm text-left text-muted-foreground font-medium">
                        <Label htmlFor="image-upload">파일 업로드</Label>
                        <ul>
                          <li> - 최대 5개</li>
                          <li> - 파일 당 최대 5MB</li>
                          <li> - 파일 확장자: .jpg, .jpeg, .png, .webp</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-6">
                        {initialImages.map((image, index) => (
                          <div key={index} className="relative group">
                            {image === "" ? (
                              <Skeleton className="aspect-square rounded-md" />
                            ) : (
                              <img
                                src={`${API_URL}/${image}`}
                                alt={`Thumbnail ${index + 1}`}
                                className="aspect-square rounded-md object-cover"
                              />
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute top-1 right-1 flex w-5 h-5 md:w-9 md:h-9"
                              onClick={() => handleRemoveInitialImage(index)}
                            >
                              <X className="w-4 h-4" />
                              <span className="sr-only">이미지 제거</span>
                            </Button>
                          </div>
                        ))}
                        {previewImages.map((image, index) => (
                          <div key={index} className="relative group">
                            {image === "" ? (
                              <Skeleton className="aspect-square rounded-md" />
                            ) : (
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="aspect-square rounded-md object-cover"
                              />
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute top-1 right-1 flex w-5 h-5 md:w-9 md:h-9"
                              onClick={() => handleRemoveUploadedImage(index)}
                            >
                              <X className="w-4 h-4" />
                              <span className="sr-only">이미지 제거</span>
                            </Button>
                          </div>
                        ))}
                        <TooltipWrapper tooltipText="이미지 업로드">
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-square rounded-md w-full h-full border-2 border-dashed border-muted flex items-center justify-center"
                            onClick={() => {
                              document.getElementById("image-upload")?.click();
                            }}
                          >
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="sr-only">이미지 업로드</span>
                          </Button>
                        </TooltipWrapper>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                      />
                    </div>
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
                    <div className="flex items-center gap-2">
                      <Input
                        className="w-full md:w-1/4"
                        placeholder="입력 후 엔터를 눌러 태그 생성(최대 5개)"
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
          <div className="flex items-center gap-4 justify-end">
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
            <Button type="submit">
              {reviewInfo ? "리뷰 수정" : "리뷰 업로드"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
