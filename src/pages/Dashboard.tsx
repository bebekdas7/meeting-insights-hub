import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard, SkeletonTable } from '@/components/SkeletonLoaders';
import { api } from '@/services/api';
import type { DashboardStats, Meeting } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch dashboard stats
    api.meetings.getDashboard?.()
      .then((res: any) => {
        if (res) {
          setStats({
            totalMeetings: res.totalMeetings,
            pendingMeetings: res.pendingMeetings,
            pendingTasks: res.pendingActionItems, // map API field
            completedTasks: res.completedActionItems // map API field
          });
        } else {
          setStats(null);
        }
      })
      .catch(() => setStats(null));

    // Fetch recent meetings
    api.meetings.getRecent?.()
      .then((res: any) => {
        if (res && res.meetings) {
          setMeetings(res.meetings.map((meeting: any) => ({
            id: meeting.id,
            title: meeting.title || meeting.summary || 'Untitled Meeting',
            filename: meeting.video_path?.split('\\').pop() || '',
            uploadDate: meeting.created_at,
            status: meeting.status,
            videoUrl: meeting.video_path,
            transcript: meeting.transcript,
            summary: meeting.summary,
            duration: meeting.duration || '—',
          })));
        } else {
          setMeetings([]);
        }
      })
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>Overview of your meeting intelligence</p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard title="Total Meetings" value={stats.totalMeetings} icon={Video} delay={100} />
          <KPICard title="Pending Tasks" value={stats.pendingTasks} icon={Clock} delay={160} />
          <KPICard title="Completed Tasks" value={stats.completedTasks} icon={CheckCircle2} delay={220} />
          <KPICard title="Pending Meetings" value={stats.pendingMeetings} icon={Loader2} delay={280} />
        </div>
      )}

      {/* Recent meetings */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-foreground">Recent Meetings</h2>
        {loading ? (
          <SkeletonTable rows={4} />
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
                {meetings.map((m, i) => (
                  <tr
                    key={m.id}
                    onClick={() => navigate(`/meetings/${m.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/30 animate-fade-up opacity-0"
                    style={{ animationDelay: `${300 + i * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="px-4 py-3.5 font-medium text-card-foreground">{m.title}</td>
                    <td className="hidden sm:table-cell px-4 py-3.5 text-muted-foreground">
                      {new Date(m.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3.5 text-muted-foreground tabular-nums">{m.duration ?? '—'}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
