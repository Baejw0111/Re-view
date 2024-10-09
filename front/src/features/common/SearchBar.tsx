import { useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/shared/shadcn-ui/command";

export default function SearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        className="h-9 w-full md:w-60 border border-foreground/10"
        onClick={() => setOpen(true)}
      >
        <div className="w-full flex items-center gap-2 text-foreground/50">
          <Search className="h-5 w-5" />
          검색
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="검색어를 입력해주세요." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="연관 태그"></CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="인기 태그"></CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="최근 검색어">
            <CommandItem>
              <span>Calendar</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
