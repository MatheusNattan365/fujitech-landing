import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface-muted px-2.5 py-1 text-sm font-medium text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}
