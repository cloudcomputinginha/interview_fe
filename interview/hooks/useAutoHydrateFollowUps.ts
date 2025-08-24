// interview/hooks/useAutoHydrateFollowUps.ts
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { aiGetSession } from '@/interview/api/api'
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { syncStoreFromInterviewSession } from '@/interview/services/sessionSync'

type TeamLite = {
	activePid: string | null
	index: number
	fIndexCurrent: number
} | null

/**
 * follow-up 이 없거나 기대치보다 적으면 주기적으로 GET → store 싱크.
 * - 기대 길이: 서버 스냅샷 qa_flow[qIndex].follow_up_length
 * - 성공 조건: store 의 followUps.length >= expected  (또는 서버 배열 길이 > 0)
 * - 반환: hydrating UI 에 바로 쓸 수 있는 상태
 */
export function useAutoHydrateFollowUps(
	sessionsMap: Record<string, string>,
	team: TeamLite,
	opts: { intervalMs?: number; maxAttempts?: number } = {}
) {
	const intervalMs = opts.intervalMs ?? 1000
	const maxAttempts = opts.maxAttempts ?? 10

	const [hydrating, setHydrating] = useState(false)
	const [expected, setExpected] = useState(0)
	const [current, setCurrent] = useState(0)

	// 폴링 Key: 활성 참가자 세션 + 질문 인덱스
	const key = useMemo(() => {
		if (!team || team.index < 0 || !team.activePid) return ''
		const sid = sessionsMap[team.activePid]
		return sid ? `${sid}:${team.index}` : ''
	}, [sessionsMap, team])

	const abortRef = useRef<{ abort: boolean }>({ abort: false })
	const ranKeyRef = useRef<string>('') // 같은 상태 반복 실행 방지

	useEffect(() => {
		// follow-up 단계가 아니면 폴링 불필요
		if (!team || team.index < 0 || team.fIndexCurrent < 0 || !team.activePid) {
			setHydrating(false)
			setExpected(0)
			setCurrent(0)
			return
		}
		if (!key || ranKeyRef.current === key) return
		ranKeyRef.current = key

		const sid = sessionsMap[team.activePid]
		if (!sid) return

		abortRef.current.abort = false
		;(async () => {
			setHydrating(true)

			let attempt = 0
			while (attempt < maxAttempts && !abortRef.current.abort) {
				attempt++
				try {
					const snap = await aiGetSession(sid)
					// 서버 스냅샷을 스토어에 반영
					syncStoreFromInterviewSession(snap)

					// 기대/현재 길이 갱신
					const q = snap.qa_flow?.[team.index]
					const exp = q?.follow_up_length ?? 0
					setExpected(exp)

					const st = useInterviewStore.getState()
					const cur = st.followUpQuestions[sid]?.[team.index]?.length ?? 0
					setCurrent(cur)

					// ✅ 성공 조건: 기대 길이를 채웠거나, 서버 배열이 1개 이상
					const serverLen = Array.isArray(q?.follow_ups)
						? q!.follow_ups!.length
						: 0
					const ok = (exp > 0 && cur >= exp) || serverLen > 0
					if (ok) break
				} catch {
					// 네트워크 오류는 조용히 재시도
				}
				await new Promise(res => setTimeout(res, intervalMs))
			}

			setHydrating(false)
		})()

		return () => {
			abortRef.current.abort = true
		}
	}, [key, sessionsMap, team, intervalMs, maxAttempts])

	return { hydrating, expected, current }
}
