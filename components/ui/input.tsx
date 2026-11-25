import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

export default function Input({ className, ...props }: InputPrimitive.Props) {
  return <InputPrimitive className={cn("flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
