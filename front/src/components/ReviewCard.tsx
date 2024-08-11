import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/util/interface";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";

// 피드에서 한 리뷰의 요약된 정보를 보여주는 컴포넌트

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewCard({ reviewData }: { reviewData: Review }) {
  const { author, title, reviewText, images } = reviewData;

  return (
    <>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow grid grid-cols-2 h-60 relative">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {author}
            </span>
          </div>
          <h3 className="text-lg text-left font-semibold mb-2">{title}</h3>
          <div className="flex items-center mb-2">
            <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
            <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
            <Star className="w-3 h-3 fill-primary mr-1 flex-shrink-0" />
            <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
            <Star className="w-3 h-3 fill-muted stroke-muted-foreground mr-1 flex-shrink-0" />
          </div>
          <p className="text-sm text-left text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-normal break-words">
            {reviewText}
          </p>
          <div className="flex items-center justify-start absolute bottom-4 left-4">
            <Heart className="w-5 h-5 flex-shrink-0 mr-2" />
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
          </div>
        </div>
        <img
          src={`${API_URL}/${images[0]}`}
          alt="Product Image"
          width={400}
          height={300}
          className="w-full h-full object-cover"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
      </Card>
    </>
  );
}
