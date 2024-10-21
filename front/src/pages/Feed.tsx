import Reviews from "@/widgets/Reviews";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/api/review";

export default function Feed() {
  const {
    data: feed,
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;
  return (
    <PageTemplate pageName="피드">
      {isSuccess && <Reviews reviewIdList={feed} />}
    </PageTemplate>
  );
}
