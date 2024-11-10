import { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import { ChevronRight, Search } from "lucide-react";
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

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // 인기 태그 불러오기
  const { data: popularTags, refetch: refetchPopularTags } = useQuery({
    queryKey: ["popularTags"],
    queryFn: fetchPopularTags,
  });
  // 최근 검색어 불러오기 및 저장 기능 필요

  // 연관 태그 불러오기
  const { data: searchRelatedTags, refetch: refetchSearchRelatedTags } =
    useQuery({
      queryKey: ["searchRelatedTags"],
      queryFn: () => fetchSearchRelatedTags(searchQuery),
      enabled: !!searchQuery,
    });

  const onOpenSearchDialog = () => {
    setOpen(true);
    refetchPopularTags();
  };

  useEffect(() => {
    if (searchQuery) {
      refetchSearchRelatedTags();
    }
  }, [searchQuery]);

  return (
    <>
      <Button
        variant="secondary"
        className="h-9 w-full md:w-60 border border-foreground/10"
        onClick={onOpenSearchDialog}
      >
        <div className="w-full flex items-center gap-2 text-foreground/50">
          <Search className="h-5 w-5" />
          검색
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="검색어를 입력해주세요."
          value={searchQuery}
          onValueChange={(value) => setSearchQuery(value)}
        />
        <CommandList>
          {searchQuery && (
            <>
              <CommandGroup heading="">
                <CommandItem key={searchQuery}>
                  "{searchQuery}" 검색 <ChevronRight />
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="">
                {searchRelatedTags &&
                  searchRelatedTags.map((tag: string) => (
                    <CommandItem key={tag}>{tag}</CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          {!searchQuery && (
            <>
              <CommandGroup heading="최근 검색어">
                <CommandItem>
                  <span>Calendar</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="인기 태그">
                {popularTags &&
                  popularTags.map((tag: string) => (
                    <CommandItem key={tag}>{tag}</CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
