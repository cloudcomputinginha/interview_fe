import { useMutation, UseMutationResult } from '@tanstack/react-query'
import {
	answerMainQuestion,
	generateFollowUpQuestions,
} from '@/apis/ai-interview'
import { InterviewSession } from '@/apis/types/interview-types'
import { preloadAllAudios } from '@/utils/audio'
import { InterviewState } from '@/types/interview/interview'

interface UseSubmitMainAnswerProps {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
	setAudioUrlMap: React.Dispatch<React.SetStateAction<Record<string, string>>>
	audioUrlMap: Record<string, string>
}

export function useSubmitMainAnswer({
	interviewState,
	setInterviewState,
	audioUrlMap,
	setAudioUrlMap,
}: UseSubmitMainAnswerProps) {
	return useMutation({
		mutationFn: async ({
			answer,
			isText,
		}: {
			answer: string
			isText: boolean
		}) => {
			const { session, currentQuestionIdx } = interviewState
			if (!session?.sessionId) {
				throw new Error('세션이 없습니다.')
			}

			if (isText) {
				await answerMainQuestion(session.sessionId, currentQuestionIdx, {
					answer,
				})
			}

			return await generateFollowUpQuestions(
				session.sessionId,
				currentQuestionIdx
			)
		},
		onSuccess: async (sessionWithFollowUp: InterviewSession) => {
			// 상태를 한 번에 업데이트
			setInterviewState(prev => ({
				...prev,
				session: sessionWithFollowUp,
				currentFollowUpIdx: prev.currentFollowUpIdx + 1,
				isQuestionLoading: false,
			}))

			// 새로운 오디오 프리로딩
			try {
				const urlMap = await preloadAllAudios(
					sessionWithFollowUp.qaFlow,
					audioUrlMap
				)
				setAudioUrlMap(prev => ({
					...prev,
					...urlMap,
				}))
			} catch (error) {
				console.error('오디오 프리로딩 실패:', error)
			}
		},
		onError: () => {
			setInterviewState(prev => ({
				...prev,
				error: '답변 저장에 실패했습니다.',
				isQuestionLoading: false,
			}))
		},
	})
}
