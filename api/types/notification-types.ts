// 알림 타입
export type NotificationType =
  | "ROOM_ENTRY"
  | "INTERVIEW_REMINDER_1D"
  | "INTERVIEW_REMINDER_30M"
  | "FEEDBACK_RECEIVED";

// 알림 DTO
export interface NotificationDTO {
  type?: NotificationType;
  url?: string;
  message?: string;
  createdAt?: string;
  read?: boolean;
}

// 알림 목록 DTO
export interface NotificationListDTO {
  notifications?: NotificationDTO[];
  size?: number;
}

// 알림 목록 응답 래퍼
export interface ApiResponseNotificationListDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: NotificationListDTO;
}

// 피드백 도착 알림 DTO
export interface FeedbackArrivedDTO {
  interviewId: number;
  memberInterviewId: number;
}

// 빈 응답 래퍼
export interface ApiResponseVoid {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: object;
}

// SSE Emitter
export interface SseEmitter {
  timeout?: number;
}
