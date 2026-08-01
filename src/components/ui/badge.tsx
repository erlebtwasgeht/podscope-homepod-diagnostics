import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]",
        accent: "border-[var(--color-accent)]/25 bg-[var(--color-info-dim)] text-[var(--color-accent)]",
        ok: "border-[var(--color-ok)]/25 bg-[var(--color-ok-dim)] text-[var(--color-ok)]",
        warn: "border-[var(--color-warn)]/25 bg-[var(--color-warn-dim)] text-[var(--color-warn)]",
        critical:
          "border-[var(--color-critical)]/25 bg-[var(--color-critical-dim)] text-[var(--color-critical)]",
        outline: "border-[var(--color-border-strong)] text-[var(--color-fg-muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
