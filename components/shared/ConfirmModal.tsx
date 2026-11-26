"use client";

import { useCallback, useState, type ReactElement } from "react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ConfirmModalProps = {
  trigger: ReactElement;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ConfirmModal({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  open,
  onOpenChange,
}: ConfirmModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isPending) {
        return;
      }
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, isPending, onOpenChange],
  );

  return (
    <Modal
      trigger={trigger}
      title={title}
      description={description}
      open={currentOpen}
      onOpenChange={handleOpenChange}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => onConfirm()}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        This action cannot be undone for this session.
      </p>
    </Modal>
  );
}

export type { ConfirmModalProps };
