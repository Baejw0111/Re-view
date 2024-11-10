import { Badge } from "@/shared/shadcn-ui/badge";
import { Link } from "react-router-dom";

export default function TagBadge({ tag }: { tag: string }) {
  return (
    <Link to={`/search?query=${tag}`}>
      <Badge className="whitespace-nowrap cursor-pointer">{tag}</Badge>
    </Link>
  );
}
