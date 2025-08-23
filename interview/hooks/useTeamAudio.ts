import { useEffect, useRef } from 'react'

export function useTeamAudio(streamTo: WebSocket | null, enabled: boolean) {
	const audioCtxRef = useRef<AudioContext | null>(null)
	const processorRef = useRef<ScriptProcessorNode | null>(null)
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

	useEffect(() => {
		if (!enabled || !streamTo) return
		let closed = false

		;(async () => {
			const ac = new AudioContext({ sampleRate: 16000 }) // 16k
			audioCtxRef.current = ac

			const media = await navigator.mediaDevices.getUserMedia({
				audio: {
					channelCount: 1,
					noiseSuppression: true,
					echoCancellation: true,
				},
			})
			const src = ac.createMediaStreamSource(media)
			sourceRef.current = src

			// ScriptProcessor는 deprecated지만 간단 구현에 충분 (Worklet로 교체 가능)
			const proc = ac.createScriptProcessor(4096, 1, 1)
			processorRef.current = proc

			proc.onaudioprocess = e => {
				if (closed || streamTo.readyState !== WebSocket.OPEN) return
				const input = e.inputBuffer.getChannelData(0)
				// Float32 [-1,1] → 16-bit PCM little-endian
				const pcm = new Int16Array(input.length)
				for (let i = 0; i < input.length; i++) {
					const s = Math.max(-1, Math.min(1, input[i]))
					pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
				}
				streamTo.send(pcm.buffer)
			}

			src.connect(proc)
			proc.connect(ac.destination)
		})()

		return () => {
			closed = true
			processorRef.current?.disconnect()
			sourceRef.current?.disconnect()
			audioCtxRef.current?.close().catch(() => {})
			processorRef.current = null
			sourceRef.current = null
			audioCtxRef.current = null
		}
	}, [enabled, streamTo])
}
