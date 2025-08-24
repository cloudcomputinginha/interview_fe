'use client'
import { MutableRefObject } from 'react'
import { usePcmSender } from '@/interview/hooks/usePcmSender'
import { usePcmPlayer } from '@/interview/hooks/usePcmPlayer'

export function AudioIO({
	sendWsRef,
	playWsRef,
	canSend,
	canPlay = true,
}: {
	sendWsRef: MutableRefObject<WebSocket | null>
	playWsRef: MutableRefObject<WebSocket | null>
	canSend: boolean
	canPlay?: boolean
}) {
	usePcmSender(sendWsRef.current, canSend)
	const { lagMs } = usePcmPlayer(playWsRef.current, canPlay)
	return (
		<div className="text-xs text-gray-500">
			🎧 {canPlay ? `지연≈${lagMs}ms` : '음소거'}
		</div>
	)
}
