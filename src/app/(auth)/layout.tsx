import { BrandLogo } from "@/components/marketing/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex justify-center pt-10 pb-4">
        <BrandLogo />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
