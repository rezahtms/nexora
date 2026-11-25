"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import Button from "@/components/ui/button";

export default function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", pending = false, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; confirmLabel?: string; pending?: boolean; onConfirm: () => void }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="dialog-backdrop" />
        <AlertDialog.Popup className="dialog-popup max-w-md">
          <AlertDialog.Title className="text-lg font-semibold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">{description}</AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Button className="min-h-11" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="min-h-11" variant="destructive" disabled={pending} onClick={onConfirm}>{pending ? "Working…" : confirmLabel}</Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
