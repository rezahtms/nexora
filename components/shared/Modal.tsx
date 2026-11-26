"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
};

export default function Modal({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  contentClassName,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent
        className={cn(
          "inset-x-0 bottom-0 top-auto max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-2xl p-0 md:inset-x-auto md:bottom-auto md:top-1/2 md:left-1/2 md:max-h-[90dvh] md:w-[calc(100%-2rem)] md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
          contentClassName,
        )}
      >
        <DialogHeader className="border-b px-5 py-4 text-left sm:px-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <DialogFooter className="border-t px-5 py-4 sm:px-6">{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}

export type { ModalProps };
