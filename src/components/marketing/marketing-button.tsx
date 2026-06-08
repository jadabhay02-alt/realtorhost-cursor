import Link from "next/link";
import { cn } from "@/lib/utils";

type MarketingButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg";
  className?: string;
};

export function MarketingButton({
  href,
  children,
  variant = "primary",
  size = "default",
  className,
}: MarketingButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        size === "lg" ? "h-11 px-6 text-sm" : "h-9 px-4 text-sm",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
          "border border-border bg-card text-foreground hover:bg-muted/50",
        variant === "ghost" && "text-foreground hover:bg-muted/60",
        className
      )}
    >
      {children}
    </Link>
  );
}
