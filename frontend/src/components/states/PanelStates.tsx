import { AlertTriangle, FileQuestion, Loader2 } from 'lucide-react';

export function SkeletonState() {
  return (
    <div className="space-y-2" aria-label="Loading">
      <div className="h-3 w-3/4 animate-pulseSoft rounded bg-dt-border" />
      <div className="h-3 w-2/3 animate-pulseSoft rounded bg-dt-border" />
      <div className="h-3 w-1/2 animate-pulseSoft rounded bg-dt-border" />
    </div>
  );
}

export function EmptyState({ label = 'No data available' }: { label?: string }) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center gap-2 text-center text-dt-muted">
      <FileQuestion className="h-4 w-4" />
      <p className="text-xs">{label}</p>
    </div>
  );
}

export function ErrorState({ label = 'Unable to load panel data' }: { label?: string }) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center gap-2 text-center text-rose-300">
      <AlertTriangle className="h-4 w-4" />
      <p className="text-xs">{label}</p>
    </div>
  );
}

export function InlineLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-dt-muted">
      <Loader2 className="h-3 w-3 animate-spin" /> {label}
    </span>
  );
}
