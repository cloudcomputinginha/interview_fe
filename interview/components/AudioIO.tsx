// components/AudioIO.tsx
'use client'
import { usePcmSender } from '@/interview/hooks/usePcmSender'
import { usePcmPlayer } from '@/interview/hooks/usePcmPlayer'
import { MutableRefObject } from 'react'

export function AudioIO({
	wsRef,
	canSend, // 내가 활성자일 때 true
	canPlay, // 항상 true 추천 (본인 음성은 서버가 exclude하므로 에코 적음)
}: {
	wsRef: MutableRefObject<WebSocket | null>
	canSend: boolean
	canPlay: boolean
}) {
	usePcmSender(wsRef.current, canSend)
	const { lagMs } = usePcmPlayer(wsRef.current, canPlay)

	return (
		<div className="text-xs text-gray-500">
			{canSend ? '🎙️ 송출 중' : '마이크 대기'} · 재생지연≈{lagMs}ms
		</div>
	)
}
