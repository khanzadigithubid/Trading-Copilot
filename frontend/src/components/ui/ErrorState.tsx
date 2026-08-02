interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-6 text-center">
      <span className="text-3xl">⚠️</span>
      <p className="mt-3 text-sm font-medium text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full border border-red-500/30 px-5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
}
