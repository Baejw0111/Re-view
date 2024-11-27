import { Progress } from "@/shared/shadcn-ui/progress";

export default function UploadProgressBar({
  isUploading,
  uploadProgress,
}: {
  isUploading: boolean;
  uploadProgress: number;
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isUploading
          ? "opacity-100 translate-y-0 h-10"
          : "opacity-0 -translate-y-full h-0"
      }`}
    >
      <span className="text-sm">파일 업로드 중...</span>
      <Progress value={uploadProgress} />
    </div>
  );
}
