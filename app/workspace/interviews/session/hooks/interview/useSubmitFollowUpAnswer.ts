import { useMutation } from '@tanstack/react-query'
import { answerFollowUpQuestion, generateFeedback } from '@/apis/ai-interview'
import { InterviewState } from '@/types/interview/interview'
import { toast } from 'sonner'

type UseSubmitFollowUpAnswerProps = {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
	audioUrlMap: Record<string, string>
}

export const useSubmitFollowUpAnswer = ({
	interviewState,
	setInterviewState,
}: UseSubmitFollowUpAnswerProps) => {
	return useMutation({
		mutationFn: async ({
			answer,
			isText,
		}: {
			answer: string
			isText: boolean
		}) => {
			const { session, currentQuestionIdx, currentFollowUpIdx } = interviewState
			if (!session?.sessionId || currentFollowUpIdx === -1) {
				toast.error('세션이 없거나 팔로우업 인덱스가 잘못되었습니다.')
				throw new Error('세션이 없거나 팔로우업 인덱스가 잘못되었습니다.')
			}

			if (isText) {
				try {
					await answerFollowUpQuestion(
						session.sessionId,
						currentQuestionIdx,
						currentFollowUpIdx,
						{ answer }
					)
				} catch (error) {
					toast.error('팔로우업 답변 저장에 실패했습니다.')
					throw error
				}
			}

			// 마지막 팔로우업인지 확인
			const currentQuestion = session.qaFlow[currentQuestionIdx]
			const isLastFollowUp =
				currentQuestion.followUps &&
				currentQuestion.followUps.length - 1 === currentFollowUpIdx

			if (isLastFollowUp) {
				await generateFeedback(session.sessionId, currentQuestionIdx)
			}

			return { isLastFollowUp }
		},
		onSuccess: ({ isLastFollowUp }) => {
			setInterviewState(prev => ({
				...prev,
				isFeedbackLoading: false,
				currentFollowUpIdx: isLastFollowUp ? -1 : prev.currentFollowUpIdx + 1,
				currentQuestionIdx: isLastFollowUp
					? prev.currentQuestionIdx + 1
					: prev.currentQuestionIdx,
			}))
		},
		onError: () => {
			setInterviewState(prev => ({
				...prev,
				error: '팔로우업 답변 저장에 실패했습니다.',
				isFeedbackLoading: false,
			}))
		},
	})
}
