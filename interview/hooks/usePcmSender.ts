// hooks/usePcmSender.ts
'use client'
import { useEffect, useRef } from 'react'

/** 마이크를 mono 16kHz 16bit PCM으로 변환해 WebSocket으로 바이너리 전송 */
export function usePcmSender(ws: WebSocket | null, enabled: boolean) {
	const acRef = useRef<AudioContext | null>(null)
	const srcRef = useRef<MediaStreamAudioSourceNode | null>(null)
	const procRef = useRef<ScriptProcessorNode | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

	useEffect(() => {
		if (!enabled || !ws) return
		let closed = false

		;(async () => {
			// 1) 마이크 권한 & 오디오 컨텍스트(16k)
			const ac = new AudioContext({ sampleRate: 16000 })
			acRef.current = ac
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					channelCount: 1,
					noiseSuppression: true,
					echoCancellation: true,
					autoGainControl: true,
				},
			})
			streamRef.current = stream
			const src = ac.createMediaStreamSource(stream)
			srcRef.current = src

			// 2) ScriptProcessor로 프레임 단위 콜백 (간단 구현; Worklet로 대체 가능)
			const proc = ac.createScriptProcessor(4096, 1, 1)
			procRef.current = proc
			proc.onaudioprocess = e => {
				if (closed || ws.readyState !== WebSocket.OPEN) return
				const ch0 = e.inputBuffer.getChannelData(0) // Float32 [-1,1]
				const pcm = new Int16Array(ch0.length)
				for (let i = 0; i < ch0.length; i++) {
					const s = Math.max(-1, Math.min(1, ch0[i]))
					pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
				}
				// 3) 그대로 바이너리 전송
				ws.send(pcm.buffer)
			}

			src.connect(proc)
			// Safari 등 일부 브라우저에서 연결 필요
			proc.connect(ac.destination)
		})()

		return () => {
			closed = true
			try {
				procRef.current?.disconnect()
			} catch (e) {
				console.warn('usePcmSender: proc.disconnect', e)
			}
			try {
				srcRef.current?.disconnect()
			} catch (e) {
				console.warn('usePcmSender: src.disconnect', e)
			}
			try {
				streamRef.current?.getTracks().forEach(t => t.stop())
			} catch (e) {
				console.warn('usePcmSender: stream.stop', e)
			}
			try {
				acRef.current?.close()
			} catch (e) {
				console.warn('usePcmSender: ac.close', e)
			}
			procRef.current = null
			srcRef.current = null
			streamRef.current = null
			acRef.current = null
		}
	}, [enabled, ws])
}
