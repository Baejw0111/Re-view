import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/shadcn-ui/card";
import { Button } from "@/shared/shadcn-ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PolicySection() {
  const policies = [
    {
      id: "terms",
      title: "이용 약관",
      description:
        "서비스 이용에 대한 약관 및 규정, 이용자의 권리와 의무에 대한 내용을 확인할 수 있습니다.",
    },
    {
      id: "privacy",
      title: "개인정보 처리방침",
      description: "서비스 개인정보 처리방침에 대한 내용을 확인할 수 있습니다.",
    },
  ];
  return (
    <div className="grid gap-6">
      {policies.map((policy) => (
        <Card key={policy.id}>
          <CardHeader>
            <CardTitle>{policy.title}</CardTitle>
            <CardDescription>{policy.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to={`/policies/${policy.id}`}>
                약관 보기
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
