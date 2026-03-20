export type MeetingStatus = 'uploading' | 'processing' | 'completed' | 'failed';
export type ActionItemStatus = 'pending' | 'done';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Meeting {
  id: string;
  title: string;
  filename: string;
  uploadDate: string;
  status: MeetingStatus;
  videoUrl?: string;
  transcript?: string;
  summary?: string;
  duration?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  meetingTitle: string;
  description: string;
  assignee: string;
  status: ActionItemStatus;
}

export interface DashboardStats {
  totalMeetings: number;
  pendingTasks: number;
  completedTasks: number;
  processingMeetings: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
