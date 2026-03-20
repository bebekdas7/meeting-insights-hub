import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonTable } from '@/components/SkeletonLoaders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMeetings } from '@/services/mockData';
import type { Meeting, MeetingStatus } from '@/types';

const STATUSES: (MeetingStatus | 'all')[] = ['all', 'completed', 'processing', 'failed'];

export default function MyMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => { setMeetings(mockMeetings); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return meetings.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [meetings, search, statusFilter]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>My Meetings</h1>
          <p className="mt-1 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>All your uploaded meeting recordings</p>
        </div>
        <Button onClick={() => navigate('/upload')} className="active:scale-[0.98] transition-transform">
          Upload New
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search meetings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Video className="h-8 w-8" />}
          title="No meetings found"
          description={search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Upload your first meeting to get started'}
          action={!search && statusFilter === 'all' ? <Button onClick={() => navigate('/upload')}>Upload Meeting</Button> : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr
                  key={m.id}
                  onClick={() => navigate(`/meetings/${m.id}`)}
                  className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/30 animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="px-4 py-3.5 font-medium text-card-foreground">{m.title}</td>
                  <td className="hidden sm:table-cell px-4 py-3.5 text-muted-foreground">
                    {new Date(m.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3.5 text-muted-foreground tabular-nums">{m.duration || '—'}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
