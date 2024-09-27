import { useEffect } from "react";
import Reviews from "@/widgets/Reviews";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setIsOpen } from "@/state/store/reviewDetailOpenSlice";
import { fetchFeed } from "@/api/review";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("reviewId") === null) {
      dispatch(setIsOpen(false));
    }
  }, [location.search, dispatch]);

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;
  return (
    <PageTemplate pageName="Feed">
      {isSuccess && <Reviews reviewIdList={feed} />}
    </PageTemplate>
  );
}
