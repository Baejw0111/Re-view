import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/shared/shadcn-ui/command";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularTags, fetchSearchRelatedTags } from "@/api/tag";
import { useSelector, useDispatch } from "react-redux";
import { setIsSearchDialogOpen } from "@/state/store/searchDialogOpenSlice";
import { RootState } from "@/state/store";
import { History } from "lucide-react";

export default function SearchDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearchDialogOpen = useSelector(
    (state: RootState) => state.searchDialogOpen.isSearchDialogOpen
  );

  const [searchQuery, setSearchQuery] = useState("");

  // 인기 태그 불러오기
  const { data: popularTags } = useQuery({
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
  const recentSearchQueries = JSON.parse(
    localStorage.getItem("recentSearchQueries") || "[]"
  );

  // 검색 모달 닫기
  const handleClose = () => {
    dispatch(setIsSearchDialogOpen(false));
  };

  // 검색 기능
  const handleSearch = (query: string) => {
    // 최근 검색어 저장
    // 중복 검색어 제거
    const updatedRecentSearchQueries = recentSearchQueries.filter(
      (q: string) => q !== query
    );
    localStorage.setItem(
      "recentSearchQueries",
      JSON.stringify([query, ...updatedRecentSearchQueries])
    );
    navigate(`/search?query=${query}`);
    handleClose();
  };

  useEffect(() => {
    if (searchQuery) {
      refetchSearchRelatedTags();
    }
  }, [searchQuery]);

  return (
    <CommandDialog open={isSearchDialogOpen} onOpenChange={handleClose}>
      <CommandInput
        placeholder="검색어를 입력해주세요."
        value={searchQuery}
        onValueChange={(value) => setSearchQuery(value)}
      />
      <CommandList>
        <CommandItem
          value="-"
          className="hidden"
          onSelect={() => handleSearch(searchQuery)}
        />
        {searchQuery && (
          <>
            <CommandGroup heading="연관 태그">
              {searchRelatedTags &&
                searchRelatedTags.map((tag: string) => (
                  <CommandItem key={tag} onSelect={() => handleSearch(tag)}>
                    {tag}
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
        <CommandGroup heading="최근 검색어">
          {recentSearchQueries.map((query: string) => (
            <CommandItem key={query} onSelect={() => handleSearch(query)}>
              <History className="w-4 h-4 mr-2" />
              {query}
            </CommandItem>
          ))}
        </CommandGroup>
        {!searchQuery && (
          <>
            <CommandSeparator />
            <CommandGroup heading="인기 태그">
              {popularTags &&
                popularTags.map((tag: string) => (
                  <CommandItem key={tag} onSelect={() => handleSearch(tag)}>
                    {tag}
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
