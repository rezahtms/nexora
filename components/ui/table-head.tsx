import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-5 py-4 text-left align-middle font-semibold whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
