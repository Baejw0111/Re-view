import { Button } from "@/shared/shadcn-ui/button";
import { X } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function PreviewImageBox({
  imageSrc,
  imageName,
  handleRemoveImage,
}: {
  imageSrc: string;
  imageName: string;
  handleRemoveImage: () => void;
}) {
  return (
    <div className="relative group">
      <img
        src={imageSrc}
        alt={imageName}
        className="aspect-square rounded-md object-cover"
      />
      <TooltipWrapper tooltipText="이미지 제거" side="top">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-1 right-1 flex w-5 h-5 md:w-9 md:h-9"
          onClick={handleRemoveImage}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">이미지 제거</span>
        </Button>
      </TooltipWrapper>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
        <p className="text-xs text-white break-all line-clamp-3">{imageName}</p>
      </div>
    </div>
  );
}
