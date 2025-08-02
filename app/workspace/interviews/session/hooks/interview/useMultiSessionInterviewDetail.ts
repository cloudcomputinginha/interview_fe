import { useQuery } from '@tanstack/react-query'
import { getGroupInterviewDetail } from '@/apis/interview'
import { useMemberSession } from '@/components/member-session-context'

export function useMultiSessionInterviewDetail(interviewId: string) {
	const { memberId } = useMemberSession()

	const {
		data: interviewDetail,
		isLoading: interviewDetailLoading,
		error: interviewDetailError,
	} = useQuery({
		queryKey: ['multiSessionInterviewDetail', interviewId],
		queryFn: () => getGroupInterviewDetail(Number(interviewId)),
		enabled: !!interviewId && !!memberId,
	})

	return {
		interviewDetail,
		interviewDetailLoading,
		interviewDetailError,
	}
}
