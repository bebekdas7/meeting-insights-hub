import { cn } from '@/lib/utils';
import type { MeetingStatus, ActionItemStatus } from '@/types';

const statusConfig: Record<string, { label: string; className: string }> = {
  uploading: { label: 'Uploading', className: 'bg-primary/10 text-primary border-primary/20' },
  processing: { label: 'Processing', className: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  done: { label: 'Done', className: 'bg-success/10 text-success border-success/20' },
};

interface StatusBadgeProps {
  status: MeetingStatus | ActionItemStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'processing' || status === 'uploading' ? 'animate-pulse' : '',
        status === 'completed' || status === 'done' ? 'bg-success' : '',
        status === 'processing' || status === 'uploading' || status === 'pending' ? 'bg-warning' : '',
        status === 'failed' ? 'bg-destructive' : '',
      )} />
      {config.label}
    </span>
  );
}
