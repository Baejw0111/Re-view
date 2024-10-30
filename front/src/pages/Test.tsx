import PageTemplate from "@/shared/original-ui/PageTemplate";
import Logo from "@/features/common/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/shadcn-ui/dialog";
import { Button } from "@/shared/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import SkeletonReviewCard from "@/shared/skeleton/SkeletonReviewCard";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/shadcn-ui/tabs";

export default function Test() {
  return (
    <>
      <PageTemplate pageName="Test">
        {/* 컴포넌트 시작 */}
        <Tabs defaultValue="latest">
          <TabsList>
            <TabsTrigger value="latest">최신글</TabsTrigger>
            <TabsTrigger value="popular">인기글</TabsTrigger>
            <TabsTrigger value="my">내가 쓴 글</TabsTrigger>
          </TabsList>
          <TabsContent value="latest">최신글</TabsContent>
          <TabsContent value="popular">인기글</TabsContent>
          <TabsContent value="my">내가 쓴 글</TabsContent>
        </Tabs>
        <SkeletonReviewCard />
        <Logo className="w-80 h-80 my-40 mx-auto" />
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Dialog with Dropdown</DialogTitle>
              <DialogDescription>
                This dialog contains a dropdown menu. Click the button below to
                open it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Dropdown</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Dialog with Dropdown</DialogTitle>
              <DialogDescription>
                This dialog contains a dropdown menu. Click the button below to
                open it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Dialog with Dropdown</DialogTitle>
                  <DialogDescription>
                    This dialog contains a dropdown menu. Click the button below
                    to open it.
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 컴포넌트 끝*/}
      </PageTemplate>
    </>
  );
}
