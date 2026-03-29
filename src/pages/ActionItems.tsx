import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonTable } from '@/components/SkeletonLoaders';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import type { ActionItem, ActionItemStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ActionItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ActionItemStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.actionItems.list()
      .then((res: any) => {
        if (Array.isArray(res.actionItems)) {
          setItems(res.actionItems.map((item: any) => ({
            id: String(item.id),
            meetingId: item.meeting_id,
            meetingTitle: item.meetingTitle || '',
            description: item.task || item.description,
            assignee: item.assignee || 'Unassigned',
            status: item.status,
          })));
        } else if (Array.isArray(res)) {
          setItems(res.map((item: any) => ({
            id: String(item.id),
            meetingId: item.meeting_id,
            meetingTitle: item.meetingTitle || '',
            description: item.task || item.description,
            assignee: item.assignee || 'Unassigned',
            status: item.status,
          })));
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const assignees = useMemo(() => [...new Set(items.map(i => i.assignee))], [items]);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchAssignee = !assigneeFilter || item.assignee === assigneeFilter;
      return matchStatus && matchAssignee;
    });
  }, [items, statusFilter, assigneeFilter]);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'pending' ? 'done' : 'pending' } : a));
    toast.success('Status updated');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>Action Items</h1>
        <p className="mt-1 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>Tasks extracted from your meetings</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {(['all', 'pending', 'done'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={assigneeFilter}
          onChange={e => setAssigneeFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">All assignees</option>
          {assignees.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No action items"
          description="Action items will appear here once meetings are processed"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
            >
              <button
                onClick={() => toggleStatus(item.id)}
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all active:scale-90',
                  item.status === 'done' ? 'border-success bg-success text-success-foreground' : 'border-border hover:border-primary'
                )}
              >
                {item.status === 'done' && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm text-card-foreground', item.status === 'done' && 'line-through text-muted-foreground')}>
                  {item.description}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.assignee}</span>
                  <span>·</span>
                  <button onClick={() => navigate(`/meetings/${item.meetingId}`)} className="hover:text-primary hover:underline transition-colors">
                    {item.meetingTitle}
                  </button>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
