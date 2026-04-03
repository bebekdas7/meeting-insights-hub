export type MeetingStatus =
  | "uploading"
  | "pending"
  | "completed"
  | "failed"
  | "uploaded";
export type ActionItemStatus = "pending" | "done";

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
  pendingMeetings: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type PurchaseStatus =
  | "paid"
  | "failed"
  | "pending"
  | "refunded"
  | string;

export interface CreditHistoryEntry {
  id: number;
  user_id: string;
  type: string;
  amount: number;
  source: string;
  reference_id: string | null;
  expiry: string | null;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreditHistoryResponse {
  success: boolean;
  data: CreditHistoryEntry[];
  pagination: PaginationMeta;
}
