import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  delay?: number;
}

export function KPICard({ title, value, icon: Icon, trend, className, delay = 0 }: KPICardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md',
        'animate-fade-up opacity-0',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-card-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className="rounded-lg bg-primary/8 p-2.5 text-primary transition-colors group-hover:bg-primary/12">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
