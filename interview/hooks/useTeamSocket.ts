// hooks/useTeamSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react'
import { useInterviewStore } from '@/interview/store/useInterviewStore'

export type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export function useTeamSocket(sessionId: string, participantId: string) {
	const wsRef = useRef<WebSocket | null>(null)
	const [team, setTeam] = useState<any>(null)
	const [status, setStatus] = useState<WsStatus>('idle')

	const { setCurrent } = useInterviewStore()

	useEffect(() => {
		if (!sessionId) return
		setStatus('connecting')
		const url = new URL(process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL!)
		url.searchParams.set('session_id', sessionId)
		url.searchParams.set('participant_id', participantId)
		url.searchParams.set('mode', 'team')

		const ws = new WebSocket(url.toString())
		wsRef.current = ws

		ws.onopen = () => {
			setStatus('open')
		}
		ws.onerror = () => {
			setStatus('error')
		}
		ws.onclose = () => {
			setStatus('closed')
		}

		ws.onmessage = e => {
			if (typeof e.data !== 'string') return
			let msg: any
			try {
				msg = JSON.parse(e.data)
			} catch {
				return
			}

			if (msg.type === 'state') {
				setTeam({
					index: msg.index,
					activePid: msg.active_pid ?? null,
					fIndexCurrent: msg.f_index_current ?? -1,
					order: msg.order ?? [],
					participantFIndex: msg.participant_f_index ?? {},
				})
				setCurrent(sessionId, msg.index, msg.f_index_current ?? -1)
			}
		}

		return () => {
			ws.close()
			wsRef.current = null
			setStatus('closed')
		}
	}, [sessionId, participantId, setCurrent])

	const send = useCallback(
		(o: any) => wsRef.current?.send(JSON.stringify(o)),
		[]
	)
	const setOrder = useCallback(
		(order: string[]) => send({ type: 'set_order', order }),
		[send]
	)
	const setActive = useCallback(
		(pid: string) => send({ type: 'set_active', participant_id: pid }),
		[send]
	)
	const advance = useCallback(() => send({ type: 'advance' }), [send])

	return { team, setOrder, setActive, advance, wsRef, status } // 🔥 status 반환
}
