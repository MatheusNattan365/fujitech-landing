import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand-blue text-white hover:bg-brand-blue-hover",
        secondary: "border border-border bg-transparent text-brand-navy hover:border-brand-navy",
        ghost: "text-ink hover:bg-ink/5",
        navy: "bg-brand-navy text-white hover:bg-navy-2",
        ember:
          "bg-craft-ember text-craft-bone hover:bg-[#2b4c7e] font-medium uppercase tracking-[0.14em] focus-visible:ring-craft-ember focus-visible:ring-offset-craft-ink",
        emberGhost:
          "border border-craft-bone/25 bg-transparent text-craft-bone hover:border-craft-ember hover:text-craft-ember font-medium uppercase tracking-[0.14em] focus-visible:ring-craft-ember focus-visible:ring-offset-craft-ink",
      },
      size: {
        md: "min-h-11 px-5 py-2.5",
        lg: "min-h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
