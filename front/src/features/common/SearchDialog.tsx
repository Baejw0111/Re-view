import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/shared/shadcn-ui/command";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularTags, fetchSearchRelatedTags } from "@/api/tag";
import { useSelector, useDispatch } from "react-redux";
import { setIsSearchDialogOpen } from "@/state/store/searchDialogOpenSlice";
import { RootState } from "@/state/store";
import { History, X } from "lucide-react";
import { Button } from "@/shared/shadcn-ui/button";

export default function SearchDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearchDialogOpen = useSelector(
    (state: RootState) => state.searchDialogOpen.isSearchDialogOpen
  );

  const [searchQuery, setSearchQuery] = useState("");

  // 인기 태그 불러오기
  const { data: popularTags, refetch: refetchPopularTags } = useQuery({
    queryKey: ["popularTags"],
    queryFn: fetchPopularTags,
  });

  // 연관 태그 불러오기
  const { data: searchRelatedTags, refetch: refetchSearchRelatedTags } =
    useQuery({
      queryKey: ["searchRelatedTags"],
      queryFn: () => fetchSearchRelatedTags(searchQuery),
      enabled: !!searchQuery,
    });

  // localStarage를 활용해 최근 검색어 불러오기 및 저장 기능 필요
  const [recentSearchQueries, setRecentSearchQueries] = useState(
    JSON.parse(localStorage.getItem("recentSearchQueries") || "[]")
  );

  // 검색 모달 닫기
  const handleClose = () => {
    dispatch(setIsSearchDialogOpen(false));
    setSearchQuery("");
  };

  // 검색 기능
  const handleSearch = (query: string) => {
    if (!query) return;
    const updatedRecentSearchQueries = recentSearchQueries.filter(
      (q: string) => q !== query
    );
    if (updatedRecentSearchQueries.length >= 5) {
      updatedRecentSearchQueries.pop();
    }
    setRecentSearchQueries([query, ...updatedRecentSearchQueries]);
    localStorage.setItem(
      "recentSearchQueries",
      JSON.stringify([query, ...updatedRecentSearchQueries])
    );
    navigate(`/search?query=${query}`);
    handleClose();
  };

  // 최근 검색어 삭제
  const handleDeleteRecentSearchQuery = (query: string) => {
    const updatedRecentSearchQueries = recentSearchQueries.filter(
      (q: string) => q !== query
    );
    localStorage.setItem(
      "recentSearchQueries",
      JSON.stringify(updatedRecentSearchQueries)
    );
    setRecentSearchQueries(updatedRecentSearchQueries);
  };

  useEffect(() => {
    if (searchQuery) {
      refetchSearchRelatedTags();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchDialogOpen) {
      refetchPopularTags();
    }
  }, [isSearchDialogOpen]);

  return (
    <CommandDialog open={isSearchDialogOpen} onOpenChange={handleClose}>
      <CommandInput
        placeholder="검색어를 입력해주세요."
        value={searchQuery}
        onValueChange={(value) => setSearchQuery(value)}
      />
      <CommandList className="overflow-hidden">
        {/* 검색 쿼리 입력 시 무조건 첫번째 요소가 select 되는 것을 방지하기 위한 장치 */}
        <CommandGroup className="hidden">
          <CommandItem
            value={searchQuery ? searchQuery : "-"}
            className="hidden"
            onSelect={() => handleSearch(searchQuery)}
          />
        </CommandGroup>
        {/* 검색창 열었을 때 최근 검색어 + 인기 태그 렌더링 */}
        <div className="flex">
          <CommandGroup heading="최근 검색어" className="flex-1 w-full pt-0">
            {recentSearchQueries.map((query: string) => (
              <CommandItem
                value={`recent-search-${query}`} // value 값이 같을 경우 중복 선택되는 현상 방지하기 위에 앞에 문자열 추가
                key={query}
                onSelect={() => handleSearch(query)}
                className="w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <History className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{query}</span>
                  </div>
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.stopPropagation(); // 버튼 클릭 시 이벤트 버블링 방지
                      handleDeleteRecentSearchQuery(query);
                    }}
                    aria-label="최근 검색어 삭제"
                    className="p-0 w-4 h-4 opacity-70 hover:opacity-100 active:opacity-100 z-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          {/* 검색 쿼리가 없을 때만 인기 태그 렌더링 */}
          {!searchQuery && (
            <>
              <CommandGroup
                heading="인기 태그"
                className="flex-1 w-full border-l"
              >
                {popularTags &&
                  popularTags.map((tag: string, index: number) => (
                    <CommandItem
                      value={`popular-tag-${index}`}
                      key={tag}
                      onSelect={() => handleSearch(tag)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">
                          {`${index + 1}.`}
                        </span>
                        <span>{tag}</span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </div>
        {/* 검색 쿼리가 있을 때만 연관 태그 렌더링 */}
        {searchQuery && (
          <CommandGroup heading="연관 태그">
            {searchRelatedTags &&
              searchRelatedTags.map((tag: string) => (
                <CommandItem
                  value={`related-tag-${tag}`}
                  key={tag}
                  onSelect={() => handleSearch(tag)}
                >
                  <span>{tag}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
