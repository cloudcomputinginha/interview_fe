// interview/hooks/useAutoPlayFollowUpAudio.ts
'use client'
import { useEffect, useMemo, useRef } from 'react'
import { AudioBus } from '@/interview/audio/audioBus'
import { useAutoHydrateFollowUps } from '@/interview/hooks/useAutoHydrateFollowUps'
import { waitForFollowUpSrc } from '@/interview/services/audioWaiter'

type TeamLite = {
	activePid: string | null
	index: number
	fIndexCurrent: number
} | null

export function useAutoPlayFollowUpAudio(
	sessionsMap: Record<string, string>,
	team: TeamLite,
	enabled: boolean
) {
	// 1) 서버와 꼬리질문 동기화(없거나 모자라면 폴링)
	const hydration = useAutoHydrateFollowUps(sessionsMap, team, {
		intervalMs: 1000,
		maxAttempts: 12,
	})

	// 2) fIndex 유효 시도마다 1회 재생
	const key = useMemo(() => {
		if (
			!enabled ||
			!team ||
			team.index < 0 ||
			team.fIndexCurrent < 0 ||
			!team.activePid
		)
			return ''
		const sid = sessionsMap[team.activePid]
		return sid ? `${sid}:F:${team.index}:${team.fIndexCurrent}` : ''
	}, [enabled, sessionsMap, team])

	const lastPlayed = useRef<string>('')

	useEffect(() => {
		if (!key || key === lastPlayed.current) return
		lastPlayed.current = key
		;(async () => {
			const [sid, , qStr, fStr] = key.split(':')
			const qIndex = Number(qStr)
			const fIndex = Number(fStr)

			// ⬇️ 핵심: 스토어에 경로가 나타날 때까지 짧게 기다린 뒤 프리로드+재생
			const src = await waitForFollowUpSrc(sid, qIndex, fIndex, {
				timeoutMs: 6000,
				intervalMs: 150,
			})
			if (!src) return
			await AudioBus.preload(src).catch(() => {})
			await AudioBus.play(src, `꼬리 ${qIndex + 1}-${fIndex + 1}`)
		})()
	}, [key])

	return hydration
}
