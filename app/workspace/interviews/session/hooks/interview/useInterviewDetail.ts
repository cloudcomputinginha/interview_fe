import { useQuery } from '@tanstack/react-query'
import { getInterviewDetail } from '@/apis/interview'
import { useMemberSession } from '@/components/member-session-context'

export function useInterviewDetail(interviewId: string) {
	const { memberId } = useMemberSession()

	const {
		data: interviewDetail,
		isLoading: interviewDetailLoading,
		error: interviewDetailError,
	} = useQuery({
		queryKey: ['interviewDetail', interviewId],
		queryFn: () => getInterviewDetail(Number(interviewId)),
		enabled: !!interviewId && !!memberId,
	})

	return {
		interviewDetail,
		interviewDetailLoading,
		interviewDetailError,
	}
}
