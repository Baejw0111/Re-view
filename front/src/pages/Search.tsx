import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [queryParams] = useSearchParams();
  const searchQuery = queryParams.get("query");

  return (
    <PageTemplate pageName={`"${searchQuery}" 검색 결과`}>
      <div>검색 페이지</div>
    </PageTemplate>
  );
}
