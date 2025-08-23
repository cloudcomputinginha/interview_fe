import { useEffect, useRef } from 'react'
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { hydrateFollowUpsFromServer } from '@/interview/services/hydrateFollowUps'

export function useAutoHydrateFollowUps(
	sessionsMap: Record<string, string>,
	team: {
		activePid: string | null
		index: number
		fIndexCurrent: number
	} | null
) {
	const prevKeyRef = useRef<string>('')

	useEffect(() => {
		if (!team || team.index < 0 || team.fIndexCurrent < 0 || !team.activePid)
			return
		const sid = sessionsMap[team.activePid]
		if (!sid) return

		const st = useInterviewStore.getState()
		const exists = st.followUpQuestions[sid]?.[team.index]
		if (exists && exists.length) return

		const key = `${sid}:${team.index}`
		if (prevKeyRef.current === key) return
		prevKeyRef.current = key

		hydrateFollowUpsFromServer(sid, team.index).catch(() => {})
	}, [sessionsMap, team])
}
