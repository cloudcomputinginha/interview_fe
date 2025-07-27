import { useQueries } from '@tanstack/react-query'
import { getInterviewDetail } from '@/apis/interview'
import { getSessionById } from '@/apis/ai-interview'
import { useMemberSession } from '@/components/member-session-context'
import type { InterviewSession } from '@/apis/types/interview-types'

interface UseInterviewQueriesProps {
	interviewId: string
	sessionId?: string
}

export function useInterviewQueries({
	interviewId,
	sessionId,
}: UseInterviewQueriesProps) {
	const { memberId } = useMemberSession()

	const queries = useQueries({
		queries: [
			{
				queryKey: ['interviewDetail', interviewId],
				queryFn: () => getInterviewDetail(Number(interviewId)),
				enabled: !!interviewId && !!memberId,
				staleTime: 5 * 60 * 1000, // 5분간 캐시
			},
			{
				queryKey: ['session', sessionId],
				queryFn: () => getSessionById(sessionId!),
				enabled: !!sessionId,
				staleTime: 2 * 60 * 1000, // 2분간 캐시
			},
		],
	})

	const [interviewDetailQuery, sessionQuery] = queries

	return {
		interviewDetail: interviewDetailQuery.data,
		interviewDetailLoading: interviewDetailQuery.isLoading,
		interviewDetailError: interviewDetailQuery.error,
		session: sessionQuery.data,
		sessionLoading: sessionQuery.isLoading,
		sessionError: sessionQuery.error,
		isLoading: interviewDetailQuery.isLoading || sessionQuery.isLoading,
		error: interviewDetailQuery.error || sessionQuery.error,
	}
}
