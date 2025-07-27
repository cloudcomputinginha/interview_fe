import { useMutation } from '@tanstack/react-query'
import { generateQuestions } from '@/apis/ai-interview'
import { InterviewSession } from '@/apis/types/interview-types'
import { useInterviewDetail } from './useInterviewDetail'
import { InterviewState } from '@/types/interview/interview'

type UseGenerateSessionProps = {
	interviewId: string
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
}

export function useGenerateSession({
	interviewId,
	setInterviewState,
}: UseGenerateSessionProps) {
	const { interviewDetail } = useInterviewDetail(interviewId)

	return useMutation({
		mutationFn: async (memberInterviewId: number) => {
			if (!interviewDetail?.result) {
				throw new Error('면접 정보가 없습니다.')
			}
			return await generateQuestions(
				interviewId,
				String(memberInterviewId),
				interviewDetail.result
			)
		},
		onSuccess: async (data: InterviewSession) => {
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
}
