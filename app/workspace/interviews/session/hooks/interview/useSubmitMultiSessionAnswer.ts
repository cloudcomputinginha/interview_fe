import { useMutation } from '@tanstack/react-query'
import {
	answerMultiSessionMainQuestion,
	generateMultiSessionFollowUpQuestions,
	answerMultiSessionFollowUpQuestion,
	generateMultiSessionFeedback,
} from '@/apis/ai-interview-multi'
import { InterviewState } from '@/types/interview/interview'
import { useCallback } from 'react'
import { toast } from 'sonner'

interface UseSubmitMultiSessionAnswerProps {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
	audioUrlMap: Record<string, string>
	loadFollowUpAudios: (questionIdx: number) => Promise<Record<string, string>>
	participantId: string
}

export function useSubmitMultiSessionAnswer({
	interviewState,
	setInterviewState,
	audioUrlMap,
	loadFollowUpAudios,
	participantId,
}: UseSubmitMultiSessionAnswerProps) {
	// 멀티 세션 메인 답변 제출 뮤테이션
	const submitMultiSessionMainAnswerMutation = useMutation({
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
				await answerMultiSessionMainQuestion(
					session.sessionId,
					currentQuestionIdx,
					participantId,
					{ answer }
				)
			}

			return await generateMultiSessionFollowUpQuestions(
				session.sessionId,
				currentQuestionIdx
			)
		},
		onSuccess: async sessionWithFollowUp => {
			console.log('멀티 세션 메인 답변 제출 성공:', sessionWithFollowUp)

			// 세션 데이터만 업데이트하고, 인덱스는 서버에서 관리하도록 함
			setInterviewState(prev => ({
				...prev,
				session: sessionWithFollowUp,
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
			toast.error('멀티 세션 답변 저장에 실패했습니다.')
			setInterviewState(prev => ({
				...prev,
				error: '멀티 세션 답변 저장에 실패했습니다.',
				isQuestionLoading: false,
			}))
		},
	})

	// 멀티 세션 팔로우업 답변 제출 뮤테이션
	const submitMultiSessionFollowUpAnswerMutation = useMutation({
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
				await answerMultiSessionFollowUpQuestion(
					session.sessionId,
					currentQuestionIdx,
					currentFollowUpIdx,
					participantId,
					{ answer }
				)
			}

			// 마지막 팔로우업인지 확인
			const currentQuestion = session.qaFlow[currentQuestionIdx]
			const isLastFollowUp =
				currentQuestion.followUps &&
				currentQuestion.followUps.length - 1 === currentFollowUpIdx

			if (isLastFollowUp) {
				await generateMultiSessionFeedback(
					session.sessionId,
					currentQuestionIdx
				)
			}

			return { isLastFollowUp }
		},
		onSuccess: ({ isLastFollowUp }) => {
			console.log('멀티 세션 팔로우업 답변 제출 성공:', { isLastFollowUp })

			// 로딩 상태만 업데이트하고, 인덱스는 서버에서 관리하도록 함
			setInterviewState(prev => ({
				...prev,
				isFeedbackLoading: false,
			}))
		},
		onError: () => {
			toast.error('멀티 세션 팔로우업 답변 저장에 실패했습니다.')
			setInterviewState(prev => ({
				...prev,
				error: '멀티 세션 팔로우업 답변 저장에 실패했습니다.',
				isFeedbackLoading: false,
			}))
		},
	})

	const handleMultiSessionMainAnswerSubmit = useCallback(
		async (answer: string, isText = false) => {
			console.log('멀티 세션 메인 답변 제출 시작:', { answer, isText })
			setInterviewState(prev => ({
				...prev,
				isQuestionLoading: true,
			}))

			try {
				// mutateAsync를 사용하여 Promise 반환
				await submitMultiSessionMainAnswerMutation.mutateAsync({
					answer,
					isText,
				})
				console.log('멀티 세션 메인 답변 제출 완료')
			} catch (error) {
				console.error('멀티 세션 메인 답변 제출 실패:', error)
				throw error
			}
		},
		[submitMultiSessionMainAnswerMutation]
	)

	const handleMultiSessionFollowUpAnswerSubmit = useCallback(
		async (answer: string, isText = false) => {
			console.log('멀티 세션 팔로우업 답변 제출 시작:', { answer, isText })
			setInterviewState(prev => ({
				...prev,
				isFeedbackLoading: true,
			}))

			try {
				// mutateAsync를 사용하여 Promise 반환
				await submitMultiSessionFollowUpAnswerMutation.mutateAsync({
					answer,
					isText,
				})
				console.log('멀티 세션 팔로우업 답변 제출 완료')
			} catch (error) {
				console.error('멀티 세션 팔로우업 답변 제출 실패:', error)
				throw error
			}
		},
		[submitMultiSessionFollowUpAnswerMutation]
	)

	return {
		handleMultiSessionMainAnswerSubmit,
		handleMultiSessionFollowUpAnswerSubmit,
	}
}
