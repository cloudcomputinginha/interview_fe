import { useMutation } from '@tanstack/react-query'
import { generateFinalReport } from '@/apis/ai-interview'
import { InterviewState } from '@/types/interview/interview'

interface UseGenerateFinalReportProps {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
}

export function useGenerateFinalReport({
	interviewState,
	setInterviewState,
}: UseGenerateFinalReportProps) {
	// 최종 리포트 생성 뮤테이션
	const generateFinalReportMutation = useMutation({
		mutationFn: async () => {
			const { session } = interviewState
			if (!session?.sessionId) {
				throw new Error('세션이 없습니다.')
			}
			return await generateFinalReport(session.sessionId)
		},
		onSuccess: report => {
			setInterviewState(prev => ({
				...prev,
				finalReport: report,
				isFinalReportLoading: false,
				readyStatus: 'INTERVIEW_FINISHED',
			}))
		},
		onError: (error: any) => {
			setInterviewState(prev => ({
				...prev,
				error: '최종 리포트 생성에 실패했습니다.',
				isFinalReportLoading: false,
			}))
		},
	})

	return generateFinalReportMutation
}
