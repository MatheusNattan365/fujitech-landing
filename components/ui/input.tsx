import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[10px] border border-border bg-surface px-4 text-base text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 aria-[invalid=true]:border-red-600",
        className,
      )}
      {...props}
    />
  );
}
