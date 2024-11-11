import { Button } from "@/shared/shadcn-ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsSearchDialogOpen } from "@/state/store/searchDialogOpenSlice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const onOpenSearchDialog = () => {
    dispatch(setIsSearchDialogOpen(true));
  };

  return (
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
  );
}
