import { useMutation } from '@tanstack/react-query'
import {
	answerMainQuestion,
	generateFollowUpQuestions,
	answerFollowUpQuestion,
	generateFeedback,
} from '@/apis/ai-interview'
import { InterviewState } from '@/types/interview/interview'
import { useCallback } from 'react'
import { toast } from 'sonner'

interface UseSubmitAnswerProps {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
	audioUrlMap: Record<string, string>
	loadFollowUpAudios: (questionIdx: number) => Promise<Record<string, string>>
}

export function useSubmitAnswer({
	interviewState,
	setInterviewState,
	audioUrlMap,
	loadFollowUpAudios,
}: UseSubmitAnswerProps) {
	// 메인 답변 제출 뮤테이션
	const submitMainAnswerMutation = useMutation({
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
		onSuccess: async sessionWithFollowUp => {
			// 상태를 한 번에 업데이트
			setInterviewState(prev => ({
				...prev,
				session: sessionWithFollowUp,
				currentFollowUpIdx: prev.currentFollowUpIdx + 1,
				isQuestionLoading: false,
			}))

			try {
				await loadFollowUpAudios(interviewState.currentQuestionIdx)
			} catch (error) {
				toast.error('팔로우업 오디오 로드 실패')
				console.error('팔로우업 오디오 로드 실패:', error)
				throw error
			}
		},
		onError: () => {
			toast.error('답변 저장에 실패했습니다.')
			setInterviewState(prev => ({
				...prev,
				error: '답변 저장에 실패했습니다.',
				isQuestionLoading: false,
			}))
		},
	})

	// 팔로우업 답변 제출 뮤테이션
	const submitFollowUpAnswerMutation = useMutation({
		mutationFn: async ({
			answer,
			isText,
		}: {
			answer: string
			isText: boolean
		}) => {
			const { session, currentQuestionIdx, currentFollowUpIdx } = interviewState
			if (!session?.sessionId || currentFollowUpIdx === -1) {
				throw new Error('세션이 없거나 팔로우업 인덱스가 잘못되었습니다.')
			}

			if (isText) {
				await answerFollowUpQuestion(
					session.sessionId,
					currentQuestionIdx,
					currentFollowUpIdx,
					{ answer }
				)
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
			toast.error('팔로우업 답변 저장에 실패했습니다.')
			setInterviewState(prev => ({
				...prev,
				error: '팔로우업 답변 저장에 실패했습니다.',
				isFeedbackLoading: false,
			}))
		},
	})

	const handleMainAnswerSubmit = useCallback(
		async (answer: string, isText = false) => {
			setInterviewState(prev => ({
				...prev,
				isQuestionLoading: true,
			}))
			submitMainAnswerMutation.mutate({ answer, isText })
		},
		[submitMainAnswerMutation]
	)

	const handleFollowUpAnswerSubmit = useCallback(
		async (answer: string, isText = false) => {
			setInterviewState(prev => ({
				...prev,
				isFeedbackLoading: true,
			}))
			submitFollowUpAnswerMutation.mutate({ answer, isText })
		},
		[submitFollowUpAnswerMutation]
	)

	return {
		handleMainAnswerSubmit,
		handleFollowUpAnswerSubmit,
	}
}
