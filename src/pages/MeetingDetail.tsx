import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, CheckSquare, Video, Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonBlock } from '@/components/SkeletonLoaders';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import type { Meeting, ActionItem } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatDurationToMinSec = (seconds: number | string | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds === '') return '—';
  const totalSeconds = typeof seconds === 'string' ? Number(seconds) : seconds;
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '—';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}.${String(secs).padStart(2, '0')} min`;
};

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'actions'>('summary');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.meetings.get(id as string),
      api.actionItems.getByMeeting(id as string)
    ])
      .then(([meetingRes, actionItemsRes]: [any, any]) => {
        // Meeting
        if (meetingRes && meetingRes.meeting) {
          setMeeting({
            id: meetingRes.meeting.id,
            title: meetingRes.meeting.title || 'Untitled Meeting',
            filename: meetingRes.meeting.video_path?.split('\\').pop() || '',
            uploadDate: meetingRes.meeting.created_at,
            status: meetingRes.meeting.status,
            videoUrl: meetingRes.meeting.video_path,
            transcript: meetingRes.meeting.transcript,
            summary: meetingRes.meeting.summary,
            duration: meetingRes.meeting.duration,
          });
          setTitleInput(meetingRes.meeting.title || 'Untitled Meeting');
        } else {
          setMeeting(null);
        }
        // Action Items
        if (actionItemsRes && Array.isArray(actionItemsRes.actionItems)) {
          setActionItems(actionItemsRes.actionItems.map((item: any) => ({
            id: String(item.id),
            meetingId: item.meeting_id,
            meetingTitle: meetingRes?.meeting?.title || '',
            description: item.task,
            assignee: item.assignee || 'Unassigned',
            status: item.status,
          })));
        } else {
          setActionItems([]);
        }
      })
      .catch(() => {
        setMeeting(null);
        setActionItems([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Title editing handlers (move out of toggleActionStatus)
  const handleEditClick = () => {
    setEditingTitle(true);
    setTitleInput(meeting?.title || "");
    setTimeout(() => {
      const input = document.getElementById("meeting-title-input");
      if (input) (input as HTMLInputElement).focus();
    }, 0);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };

  // Adjust input width to match text
  useEffect(() => {
    if (editingTitle && inputRef.current && spanRef.current) {
      // Set span text to input value
      spanRef.current.textContent = titleInput || '';
      // Add a little extra space for caret
      const width = spanRef.current.offsetWidth + 8;
      inputRef.current.style.width = width + 'px';
    }
  }, [titleInput, editingTitle]);

  const handleTitleBlur = async () => {
    if (meeting && titleInput.trim() && titleInput !== meeting.title) {
      try {
        await api.meetings.updateTitle(meeting.id, titleInput);
        setMeeting({ ...meeting, title: titleInput });
        toast.success('Title updated');
      } catch (err) {
        toast.error('Failed to update title');
        setTitleInput(meeting.title); // revert
      }
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setTitleInput(meeting?.title || "");
      setEditingTitle(false);
    }
  };

  const toggleActionStatus = (itemId: string) => {
    setActionItems(prev =>
      prev.map(a =>
        a.id === itemId ? { ...a, status: a.status === 'pending' ? 'done' : 'pending' } : a
      )
    );
    toast.success('Status updated');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <SkeletonBlock lines={5} />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Meeting not found</p>
        <Button variant="outline" onClick={() => navigate('/meetings')} className="mt-4">Go back</Button>
      </div>
    );
  }

  const tabs = [
    { key: 'summary' as const, label: 'Summary', icon: Sparkles },
    { key: 'transcript' as const, label: 'Transcript', icon: FileText },
    { key: 'actions' as const, label: `Actions (${actionItems.length})`, icon: CheckSquare },
  ];
  const formattedDuration = formatDurationToMinSec(meeting.duration);

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
      {/* Header */}
      <button
        onClick={() => navigate('/meetings')}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to meetings
      </button>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <>
                <input
                  id="meeting-title-input"
                  ref={inputRef}
                  className="text-2xl font-semibold tracking-tight text-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary px-1"
                  value={titleInput}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  maxLength={100}
                  autoFocus
                  style={{width: '6rem', minWidth: '2rem'}} // fallback width
                />
                {/* Hidden span for measuring text width */}
                <span
                  ref={spanRef}
                  className="text-2xl font-semibold tracking-tight px-1 invisible absolute whitespace-pre pointer-events-none"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', top: 0 }}
                >
                  {titleInput || ''}
                </span>
              </>
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{meeting.title}</h1>
            )}
            <button
              type="button"
              className="ml-1 p-1 rounded hover:bg-muted transition-colors"
              title="Edit title"
              onClick={handleEditClick}
              aria-label="Edit meeting title"
            >
              <Pencil className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{new Date(meeting.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            {formattedDuration !== '—' && <span className="tabular-nums">· {formattedDuration}</span>}
          </div>
        </div>
        <StatusBadge status={meeting.status} />
      </div>

      {meeting.status === 'pending' && (
        <div className="mb-6 rounded-xl border border-warning/20 bg-warning/5 p-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          <p className="text-sm text-foreground">This meeting is currently being processed. Transcript and summary will appear when ready.</p>
        </div>
      )}

      {meeting.status === 'failed' && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-foreground">Processing failed for this meeting. Please try re-uploading.</p>
        </div>
      )}

      {meeting.status === 'completed' && (
        <>
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary */}
          {activeTab === 'summary' && (
            <div className="animate-fade-up opacity-0 rounded-xl border border-border bg-card p-6" style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-card-foreground">AI Summary</h3>
              </div>
              {meeting.summary ? (
                <p className="text-sm leading-relaxed text-muted-foreground" style={{ maxWidth: '65ch' }}>{meeting.summary}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No summary available yet.</p>
              )}
            </div>
          )}

          {/* Transcript */}
          {activeTab === 'transcript' && (
            <div className="animate-fade-up opacity-0 rounded-xl border border-border bg-card p-6" style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-card-foreground">Transcript</h3>
              </div>
              {meeting.transcript ? (
                <div className="max-h-96 overflow-y-auto rounded-lg bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">{meeting.transcript}</pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No transcript available yet.</p>
              )}
            </div>
          )}

          {/* Action Items */}
          {activeTab === 'actions' && (
            <div className="animate-fade-up opacity-0 space-y-3" style={{ animationFillMode: 'forwards' }}>
              {actionItems.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  No action items extracted from this meeting.
                </div>
              ) : (
                actionItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 animate-fade-up opacity-0"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <button
                      onClick={() => toggleActionStatus(item.id)}
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all active:scale-90',
                        item.status === 'done'
                          ? 'border-success bg-success text-success-foreground'
                          : 'border-border hover:border-primary'
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
                      <p className="mt-1 text-xs text-muted-foreground">Assigned to {item.assignee}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
