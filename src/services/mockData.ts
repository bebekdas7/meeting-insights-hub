import type { Meeting, ActionItem, DashboardStats } from '@/types';

export const mockStats: DashboardStats = {
  totalMeetings: 23,
  pendingTasks: 12,
  completedTasks: 47,
  processingMeetings: 2,
};

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q1 Product Strategy Review',
    filename: 'q1-strategy.mp4',
    uploadDate: '2026-03-18T10:30:00Z',
    status: 'completed',
    duration: '47:32',
    videoUrl: '#',
    transcript: `[00:00] Sarah: Welcome everyone to our Q1 product strategy review. Let's start with the metrics overview.\n\n[00:45] Marcus: Thanks Sarah. We saw a 34% increase in active users this quarter, which exceeded our target of 25%.\n\n[02:15] Sarah: That's excellent. What drove the growth?\n\n[02:30] Marcus: Primarily the onboarding redesign we shipped in January. Conversion from signup to first action went from 38% to 61%.\n\n[04:00] Priya: On the engineering side, we reduced P95 latency by 40% after the infrastructure migration. That likely contributed to retention improvements.\n\n[06:20] Sarah: Great work. Let's discuss Q2 priorities. I'm thinking we focus on three areas: collaboration features, API platform, and mobile.\n\n[08:00] Marcus: I'd prioritize collaboration — our enterprise prospects keep asking for real-time editing and commenting.\n\n[10:30] Priya: We'll need to evaluate WebSocket infrastructure for that. I can have a technical proposal ready by next Friday.`,
    summary: 'The team reviewed Q1 performance, noting a 34% increase in active users driven by the onboarding redesign. Engineering achieved a 40% reduction in P95 latency. Q2 priorities were set around collaboration features, API platform expansion, and mobile development. Marcus will lead the collaboration feature research, while Priya will prepare a WebSocket infrastructure proposal.',
  },
  {
    id: '2',
    title: 'Design System Workshop',
    filename: 'design-workshop.mp4',
    uploadDate: '2026-03-17T14:00:00Z',
    status: 'completed',
    duration: '1:12:05',
    summary: 'Workshop covered component standardization, token naming conventions, and migration plan from legacy styles. Team agreed on atomic design methodology.',
  },
  {
    id: '3',
    title: 'Sprint 14 Planning',
    filename: 'sprint-14.mp4',
    uploadDate: '2026-03-19T09:00:00Z',
    status: 'processing',
    duration: '32:10',
  },
  {
    id: '4',
    title: 'Client Onboarding Call — Meridian Corp',
    filename: 'meridian-onboarding.mp4',
    uploadDate: '2026-03-19T16:00:00Z',
    status: 'processing',
  },
  {
    id: '5',
    title: 'Infrastructure Post-Mortem',
    filename: 'infra-postmortem.mp4',
    uploadDate: '2026-03-15T11:00:00Z',
    status: 'completed',
    duration: '28:44',
    summary: 'Root cause was an unmonitored memory leak in the cache layer. Action items include adding memory alerts and implementing circuit breakers.',
  },
  {
    id: '6',
    title: 'Investor Update Prep',
    filename: 'investor-update.mp4',
    uploadDate: '2026-03-16T10:00:00Z',
    status: 'failed',
  },
];

export const mockActionItems: ActionItem[] = [
  { id: '1', meetingId: '1', meetingTitle: 'Q1 Product Strategy Review', description: 'Prepare WebSocket infrastructure proposal for collaboration features', assignee: 'Priya Sharma', status: 'pending' },
  { id: '2', meetingId: '1', meetingTitle: 'Q1 Product Strategy Review', description: 'Research competitor collaboration feature sets', assignee: 'Marcus Chen', status: 'pending' },
  { id: '3', meetingId: '1', meetingTitle: 'Q1 Product Strategy Review', description: 'Draft Q2 OKR document with collaboration focus', assignee: 'Sarah Kim', status: 'done' },
  { id: '4', meetingId: '2', meetingTitle: 'Design System Workshop', description: 'Create component inventory spreadsheet', assignee: 'Alex Rivera', status: 'pending' },
  { id: '5', meetingId: '2', meetingTitle: 'Design System Workshop', description: 'Set up Storybook for new design tokens', assignee: 'Priya Sharma', status: 'done' },
  { id: '6', meetingId: '5', meetingTitle: 'Infrastructure Post-Mortem', description: 'Add memory usage alerts to monitoring dashboard', assignee: 'Priya Sharma', status: 'pending' },
  { id: '7', meetingId: '5', meetingTitle: 'Infrastructure Post-Mortem', description: 'Implement circuit breaker pattern in cache layer', assignee: 'Alex Rivera', status: 'pending' },
  { id: '8', meetingId: '5', meetingTitle: 'Infrastructure Post-Mortem', description: 'Write post-mortem document and share with engineering', assignee: 'Marcus Chen', status: 'done' },
];
