export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <p className="pt-4 text-sm text-muted-foreground">Coming in Phase 1–2.</p>
    </div>
  );
}
