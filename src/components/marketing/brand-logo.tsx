import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 font-medium text-foreground", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
        RH
      </span>
      <span className="text-[15px] tracking-tight">Realtor Host</span>
    </Link>
  );
}
