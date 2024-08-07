import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Review } from "@/util/interface";

// 피드에서 한 리뷰의 요약된 정보를 보여주는 컴포넌트

export default function ReviewCard({ reviewData }: { reviewData: Review }) {
  const { author, title, reviewText, rating } = reviewData;

  return (
    <>
      <div className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <img
          alt="Product Image"
          className="w-full h-48 object-cover"
          height={300}
          src="/placeholder.svg"
          style={{
            aspectRatio: "400/300",
            objectFit: "cover",
          }}
          width={400}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="flex items-center mb-2">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {author}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 fry mr-1" />
            <Star className="w-5 h-5 fry mr-1" />
            <Star className="w-5 h-5 fry mr-1" />
            <Star className="w-5 h-5 f stroke-muted-foreground mr-1" />
            <Star className="w-5 h-5 f stroke-muted-foreground mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {rating}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {reviewText}
          </p>
        </div>
      </div>
    </>
  );
}
