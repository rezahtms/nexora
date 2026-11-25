"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  isDirty: boolean;
  isSubmitting: boolean;
};

export default function SubmitButton({
  isDirty,
  isSubmitting,
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      className={cn("min-h-11", className)}
      disabled={disabled || !isDirty || isSubmitting}
      aria-busy={isSubmitting || undefined}
    >
      {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
      {children}
    </Button>
  );
}
