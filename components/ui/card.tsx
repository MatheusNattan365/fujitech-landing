import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-[0_8px_24px_-18px_rgba(16,34,56,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
