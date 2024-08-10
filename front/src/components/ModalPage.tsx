import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export default function ModalPage({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-[70vw] h-[90vh] py-10 px-10 overflow-y-auto">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-[100vh]">
        <div className="py-10 px-10 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
