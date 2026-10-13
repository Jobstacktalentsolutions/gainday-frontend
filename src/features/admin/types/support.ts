export type SupportMessageStatus = 'pending' | 'read' | 'in_progress' | 'resolved';

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: SupportMessageStatus | string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessageStats {
  total: number;
  pending: number;
  read: number;
  inProgress: number;
  resolved: number;
}

export interface SupportQueryParams {
  search?: string;
  status?: string;
  limit?: number;
}

export interface ReplySupportMessagePayload {
  replyMessage: string;
  markStatus?: string;
}
