// interview/components/WsAudioProbe.tsx
'use client'
import { MutableRefObject, useEffect } from 'react'
import { usePcmPlayerDebug } from '@/interview/hooks/usePcmPlayer.debug'

export default function WsAudioProbe({
	wsRef,
	enabled,
	tag = 'ACTIVE-ROOM',
}: {
	wsRef: MutableRefObject<WebSocket | null>
	enabled: boolean
	tag?: string
}) {
	const { lagMs } = usePcmPlayerDebug(wsRef.current, enabled, {
		debug: true, // window.__PCM_DEBUG로도 켜짐
		tag,
		targetBuffer: 0.1, // 100ms
		maxBuffer: 0.22, // 220ms 넘치면 즉시 점프
		logEvery: 1, // 시끄러우면 5~10으로
	})

	// 편의: 페이지 진입 시 전역 스위치 1회 ON
	useEffect(() => {
		;(window as any).__PCM_DEBUG = true
	}, [])

	return (
		<div className="fixed bottom-3 right-3 z-40 text-xs px-2 py-1 rounded bg-black/70 text-white shadow">
			<span className="opacity-70 mr-2">WS</span>
			<span className="font-semibold">{tag}</span>
			<span className="mx-2">|</span>
			<span className="opacity-70">lag</span>
			<span className="ml-1">{lagMs}ms</span>
		</div>
	)
}
