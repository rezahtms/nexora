import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/70 transition-colors hover:bg-muted/30 last:border-0",
        className,
      )}
      {...props}
    />
  );
}
