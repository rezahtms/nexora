import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-5 py-4 align-middle", className)}
      {...props}
    />
  );
}
