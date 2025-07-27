import { useQuery } from '@tanstack/react-query'
import { InterviewState } from '@/types/interview/interview'
import { getSessionById } from '@/apis/ai-interview'

type UseGetExistingSessionProps = {
	interviewState: InterviewState
	setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>
}

export const useGetExistingSession = ({
	interviewState,
	setInterviewState,
}: UseGetExistingSessionProps) => {
	return useQuery({
		queryKey: ['existing-session', interviewState.session?.sessionId],
		queryFn: async () => {
			return await getSessionById(interviewState.session?.sessionId)
		},
		enabled: interviewState.session?.sessionId !== undefined,
	})
}
