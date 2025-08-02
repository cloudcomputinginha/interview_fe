import { useMutation } from '@tanstack/react-query'
import {
	generateMultiSessionQuestions,
	getMultiSessionByInterviewAndMember,
} from '@/apis/ai-interview-multi'
import { InterviewState } from '@/types/interview/interview'
import { useCallback } from 'react'
import { toast } from 'sonner'

interface UseGenerateOrGetMultiSessionProps {
	interviewId: string
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
}

export function useGenerateOrGetMultiSession({
	interviewId,
	setInterviewState,
}: UseGenerateOrGetMultiSessionProps) {
	const generateSessionMutation = useMutation({
		mutationFn: async (memberInterviewId: string) => {
			return await generateMultiSessionQuestions(interviewId, memberInterviewId)
		},
		onSuccess: session => {
			setInterviewState(prev => ({
				...prev,
				session,
				isLoading: false,
				readyStatus: 'INTERVIEW_READY',
			}))
		},
		onError: error => {
			console.error('멀티 세션 생성 실패:', error)
			toast.error('멀티 세션 생성에 실패했습니다.')
			setInterviewState(prev => ({
				...prev,
				error: '멀티 세션 생성에 실패했습니다.',
				isLoading: false,
				readyStatus: 'ERROR',
			}))
		},
	})

	const handleGenerateOrGetSession = useCallback(
		async (memberInterviewId: string) => {
			console.log('멀티 세션 생성/조회 시도:', {
				interviewId,
				memberInterviewId,
			})

			try {
				// 먼저 기존 세션을 조회해보고, 없으면 새로 생성
				const existingSession = await getMultiSessionByInterviewAndMember(
					interviewId,
					memberInterviewId
				)

				if (existingSession && existingSession.sessionId) {
					console.log('기존 세션 발견:', existingSession.sessionId)
					setInterviewState(prev => ({
						...prev,
						session: existingSession,
						isLoading: false,
						readyStatus: 'INTERVIEW_READY',
					}))
				} else {
					console.log('새 세션 생성 시도')
					// 새 세션 생성
					generateSessionMutation.mutate(memberInterviewId)
				}
			} catch (error) {
				console.error('세션 조회 실패, 새로 생성:', error)
				// 조회 실패 시 새로 생성
				generateSessionMutation.mutate(memberInterviewId)
			}
		},
		[interviewId, generateSessionMutation]
	)

	return {
		handleGenerateOrGetSession,
	}
}
