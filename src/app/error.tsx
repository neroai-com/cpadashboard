"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white font-semibold transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
