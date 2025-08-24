// interview/components/AudioOutlet.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { AudioBus, type AudioBusState } from '@/interview/audio/audioBus'

export default function AudioOutlet() {
	const ref = useRef<HTMLAudioElement | null>(null)
	const [state, setState] = useState<AudioBusState>({ status: 'idle' })

	useEffect(() => {
		if (ref.current) AudioBus.attach(ref.current)
		const off = AudioBus.subscribe(setState)
		return () => {
			off()
			AudioBus.detach()
		}
	}, [])

	// 눈에 보이는 작은 상태표시 (원하면 숨겨도 됨)
	return (
		<div className="text-xs text-gray-500">
			<audio ref={ref} hidden>
				<track kind="captions" />
			</audio>
			{state.status === 'playing'
				? `🔊 재생 중: ${state.label ?? ''}`
				: state.status === 'buffering'
					? `⏳ 로딩: ${state.label ?? ''}`
					: state.status === 'error'
						? `⚠️ 재생 오류`
						: `🔇 대기`}
		</div>
	)
}
