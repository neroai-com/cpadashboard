export default function Loading() {
  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}
