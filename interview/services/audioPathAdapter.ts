// interview/services/audioPathAdapter.ts
import { useInterviewStore } from '@/interview/store/useInterviewStore'

// 질문 오디오 경로
export function getQuestionAudioPath(
	sessionId: string,
	qIndex: number
): string | undefined {
	const st = useInterviewStore.getState()
	const path = st.questionAudio?.[sessionId]?.[qIndex]
	return path ?? undefined
}

// 꼬리질문 오디오 경로
export function getFollowUpAudioPath(
	sessionId: string,
	qIndex: number,
	fIndex: number
): string | undefined {
	const st = useInterviewStore.getState()
	const path = st.followUpQuestionAudio?.[sessionId]?.[qIndex]?.[fIndex]
	return path ?? undefined
}
