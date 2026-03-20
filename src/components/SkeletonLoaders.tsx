import { cn } from '@/lib/utils';

interface SkeletonBlockProps {
  className?: string;
  lines?: number;
}

export function SkeletonBlock({ className, lines = 3 }: SkeletonBlockProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 animate-pulse rounded-md bg-muted',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6 space-y-4', className)}>
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 px-4 py-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-3 flex-1 animate-pulse rounded bg-muted" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-border px-4 py-4">
          {[1, 2, 3, 4].map(j => (
            <div key={j} className={cn('h-4 flex-1 animate-pulse rounded bg-muted', j === 4 && 'w-20 flex-none')} />
          ))}
        </div>
      ))}
    </div>
  );
}
