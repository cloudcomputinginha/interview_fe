import { useQuery } from '@tanstack/react-query'
import { preloadAllAudios } from '@/utils/audio'
import type { InterviewSession } from '@/apis/types/interview-types'

interface UseAudioPrefetchProps {
	session: InterviewSession | null
	audioUrlMap: Record<string, string>
}

export function useAudioPrefetch({
	session,
	audioUrlMap,
}: UseAudioPrefetchProps) {
	return useQuery({
		queryKey: ['audioUrlMap', session?.sessionId],
		queryFn: async () => {
			if (!session) return {}
			return await preloadAllAudios(session.qaFlow, audioUrlMap)
		},
		enabled: !!session && !!session.qaFlow,
		staleTime: 5 * 60 * 1000, // 5분간 캐시
		gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
	})
}
