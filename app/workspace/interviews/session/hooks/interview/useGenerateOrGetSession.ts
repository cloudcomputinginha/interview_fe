import { useMutation } from '@tanstack/react-query'
import { generateQuestions, getSessionById } from '@/apis/ai-interview'
import { InterviewState } from '@/types/interview/interview'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ApiResponseInterviewStartResponseDTO } from '@/apis/types/interview-types'
import { ApiError } from '@/utils/error/error'
import { errorToast } from '@/utils/error/errorToast'

interface UseGenerateOrGetSessionProps {
	interviewId: string
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
}

export function useGenerateOrGetSession({
	interviewId,
	interviewState,
	setInterviewState,
}: UseGenerateOrGetSessionProps) {
	const router = useRouter()

	// 세션 생성
	const generateSessionMutation = useMutation({
		mutationFn: async ({
			memberInterviewId,
			interviewDetail,
		}: {
			memberInterviewId: number
			interviewDetail: ApiResponseInterviewStartResponseDTO
		}) => {
			return await generateQuestions(
				interviewId,
				String(memberInterviewId),
				interviewDetail
			)
		},
		onSuccess: async data => {
			setInterviewState(prev => ({
				...prev,
				session: data,
				currentQuestionIdx: 0,
				currentFollowUpIdx: -1,
				readyStatus: 'PRELOADING_AUDIO',
				isLoading: false,
			}))
		},
		onError: (error: any) => {
			setInterviewState(prev => ({
				...prev,
				error: error.message,
				readyStatus: 'ERROR',
				isLoading: false,
			}))
		},
	})

	const handleGenerateOrGetSession = async (
		memberInterviewId: number,
		interviewDetail: ApiResponseInterviewStartResponseDTO
	) => {
		// 기존 세션이 있는지 확인
		if (interviewState.session?.sessionId) {
			try {
				const existingSession = await getSessionById(
					interviewState.session.sessionId
				)
				setInterviewState(prev => ({
					...prev,
					session: existingSession,
					currentQuestionIdx: 0,
					currentFollowUpIdx: -1,
					readyStatus: 'PRELOADING_AUDIO',
					isLoading: false,
				}))
			} catch (error) {
				if (error instanceof ApiError) {
					errorToast(error)
				} else {
					toast.error('기존 세션을 찾을 수 없어요. 새로운 세션을 생성해요.')
				}
				// 새 세션 생성
				generateSessionMutation.mutate({ memberInterviewId, interviewDetail })
			}
		} else {
			// 새 세션 생성
			generateSessionMutation.mutate({ memberInterviewId, interviewDetail })
		}
	}

	return {
		handleGenerateOrGetSession,
	}
}
