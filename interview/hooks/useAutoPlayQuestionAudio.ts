// interview/hooks/useAutoPlayQuestionAudio.ts
'use client'
import { useEffect, useMemo, useRef } from 'react'
import { AudioBus } from '@/interview/audio/audioBus'
import { getQuestionAudioPath } from '@/interview/services/audioPathAdapter'
import { waitForQuestionSrc } from '@/interview/services/audioWaiter'

type TeamLite = { activePid: string | null; index: number } | null
export function useAutoPlayQuestionAudio(
	sessionsMap: Record<string, string>,
	team: TeamLite,
	enabled: boolean
) {
	const key = useMemo(() => {
		if (!enabled || !team || team.index < 0 || !team.activePid) return ''
		const sid = sessionsMap[team.activePid]
		return sid ? `${sid}:Q:${team.index}` : ''
	}, [enabled, sessionsMap, team])

	const lastKey = useRef<string>('')

	useEffect(() => {
		if (!key || key === lastKey.current) return
		lastKey.current = key
		;(async () => {
			const [sid, , qStr] = key.split(':')
			const qIndex = Number(qStr)

			const src = await waitForQuestionSrc(sid, qIndex, {
				timeoutMs: 6000,
				intervalMs: 150,
			})
			if (!src) return
			await AudioBus.preload(src).catch(() => {})
			await AudioBus.play(src, `질문 ${qIndex + 1}`)
		})()
	}, [key])
}
