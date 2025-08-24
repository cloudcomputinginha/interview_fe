// interview/hooks/useManySockets.ts
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
type Entry = { ws: WebSocket | null; status: WsStatus }
type Backoff = { tries: number; timer?: number }

function makeWsURL(sessionId: string, participantId: string) {
	const base = process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL!
	const url = new URL(base)
	url.searchParams.set('session_id', sessionId)
	url.searchParams.set('participant_id', participantId)
	url.searchParams.set('mode', 'team') // 수신도 team으로 문제 없음
	return url.toString()
}

export function useManySockets(sessionMap: Record<string, string>) {
	const [entries, setEntries] = useState<Record<string, Entry>>({})
	const backoffRef = useRef<Record<string, Backoff>>({})
	const refsMap = useRef<Record<string, { current: WebSocket | null }>>({})

	const getRefByMember = useCallback((memberId: string) => {
		if (!refsMap.current[memberId])
			refsMap.current[memberId] = { current: null }
		return refsMap.current[memberId]
	}, [])

	const connectOne = useCallback(
		(memberId: string, sessionId: string) => {
			const url = makeWsURL(sessionId, memberId)
			setEntries(p => ({
				...p,
				[memberId]: { ws: p[memberId]?.ws ?? null, status: 'connecting' },
			}))
			const ws = new WebSocket(url)
			ws.binaryType = 'arraybuffer'

			const setStatus = (status: WsStatus, val: WebSocket | null = ws) => {
				const r = getRefByMember(memberId)
				r.current = val
				setEntries(p => ({ ...p, [memberId]: { ws: val, status } }))
			}

			ws.onopen = () => {
				backoffRef.current[memberId] = { tries: 0 }
				setStatus('open', ws)
			}
			ws.onerror = () => setStatus('error', ws)
			ws.onclose = () => {
				setStatus('closed', null)
				const bo = backoffRef.current[memberId] ?? { tries: 0 }
				const tries = Math.min(bo.tries + 1, 10)
				backoffRef.current[memberId] = { tries }
				const delay = Math.min(30000, 1000 * 2 ** (tries - 1))
				const timer = window.setTimeout(() => {
					const sid = sessionMap[memberId]
					if (sid) connectOne(memberId, sid)
				}, delay)
				backoffRef.current[memberId].timer = timer
			}
		},
		[getRefByMember, sessionMap]
	)

	useEffect(() => {
		// 추가
		Object.entries(sessionMap).forEach(([mid, sid]) => {
			if (!entries[mid]?.ws) connectOne(mid, sid)
		})
		// 제거
		Object.keys(entries).forEach(mid => {
			if (!(mid in sessionMap)) {
				try {
					entries[mid]?.ws?.close()
				} catch {
					console.error('소켓 연결 해제 실패', mid)
				}
				const bo = backoffRef.current[mid]
				if (bo?.timer) clearTimeout(bo.timer)
				delete backoffRef.current[mid]
				if (refsMap.current[mid]) refsMap.current[mid].current = null
				setEntries(p => {
					const { [mid]: _, ...rest } = p
					return rest
				})
			}
		})
		return () => {
			Object.values(entries).forEach(e => {
				try {
					e.ws?.close()
				} catch {
					console.error('소켓 연결 해제 실패', mid)
				}
			})
			Object.values(backoffRef.current).forEach(
				b => b?.timer && clearTimeout(b.timer)
			)
		}
	}, [sessionMap])

	const getWsByMember = useCallback(
		(mid: string) => entries[mid]?.ws ?? null,
		[entries]
	)
	const statuses = useMemo(
		() =>
			Object.fromEntries(
				Object.entries(entries).map(([mid, e]) => [mid, e.status])
			) as Record<string, WsStatus>,
		[entries]
	)

	return { entries, statuses, getWsByMember, getRefByMember }
}
