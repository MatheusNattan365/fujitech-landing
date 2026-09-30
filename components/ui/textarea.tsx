import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 aria-[invalid=true]:border-red-600",
        className,
      )}
      {...props}
    />
  );
}
