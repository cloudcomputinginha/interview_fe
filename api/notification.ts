import { serverFetch } from '../utils/fetch/fetch'
import {
	ApiResponseNotificationListDTO,
	FeedbackArrivedDTO,
	ApiResponseVoid,
} from './types/notification-types'

// 알림 목록 조회
export async function getNotifications() {
	return serverFetch.get<ApiResponseNotificationListDTO>('/notifications')
}

// 알림 읽음 처리
export async function readNotification(notificationId: number) {
	return serverFetch.patch<ApiResponseVoid>(
		`/notifications/${notificationId}/read`
	)
}

// 피드백 생성 완료 알림 전송 (AI 서버에서 호출)
export async function notifyFeedbackCreated(data: FeedbackArrivedDTO) {
	return serverFetch.post<ApiResponseVoid, FeedbackArrivedDTO>(
		'/notifications/feedback',
		data
	)
}
