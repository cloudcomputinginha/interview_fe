// hooks/usePcmPlayer.ts
'use client'
import { useEffect, useRef, useState } from 'react'

/** WS로 받은 16k PCM(int16 LE) 프레임들을 이어서 재생 */
export function usePcmPlayer(ws: WebSocket | null, enabled: boolean) {
	const acRef = useRef<AudioContext | null>(null)
	const procRef = useRef<ScriptProcessorNode | null>(null)
	const queueRef = useRef<Float32Array[]>([])
	const [lagMs, setLagMs] = useState(0) // 디버그용 버퍼 지연 추정

	useEffect(() => {
		if (!enabled || !ws) return
		let closed = false

		const ac = new AudioContext({ sampleRate: 16000 })
		acRef.current = ac

		// 재생용 ScriptProcessor (버퍼 큐에서 꺼내 스피커로 출력)
		const proc = ac.createScriptProcessor(4096, 1, 1)
		procRef.current = proc
		proc.onaudioprocess = e => {
			const out = e.outputBuffer.getChannelData(0)
			if (queueRef.current.length === 0) {
				// 언더런: 무음 출력
				out.fill(0)
				return
			}
			const chunk = queueRef.current.shift()!
			out.set(chunk.subarray(0, out.length))
			if (chunk.length > out.length) {
				// 남는 부분은 다음 콜백으로 다시 밀기
				queueRef.current.unshift(chunk.subarray(out.length))
			}
			// 대략적인 지연(ms) 계산
			const samplesQueued = queueRef.current.reduce(
				(sum, a) => sum + a.length,
				0
			)
			setLagMs(Math.round((samplesQueued / 16000) * 1000))
		}
		proc.connect(ac.destination)

		// WS 메시지 핸들러
		const onMessage = (ev: MessageEvent) => {
			if (typeof ev.data === 'string') return // JSON 제어는 무시
			if (!(ev.data instanceof ArrayBuffer)) {
				// 일부 브라우저는 Blob으로 올 수 있음
			}
			// ArrayBuffer 또는 Blob → ArrayBuffer
			const toArrayBuffer = (d: any): Promise<ArrayBuffer> =>
				d instanceof ArrayBuffer ? Promise.resolve(d) : d.arrayBuffer()

			toArrayBuffer(ev.data)
				.then(buf => {
					if (closed) return
					// Int16 LE → Float32 [-1,1]
					const i16 = new Int16Array(buf)
					const f32 = new Float32Array(i16.length)
					for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 0x8000
					queueRef.current.push(f32)
				})
				.catch(() => {})
		}

		ws.addEventListener('message', onMessage)

		return () => {
			closed = true
			ws.removeEventListener('message', onMessage)
			try {
				proc.disconnect()
			} catch (e) {
				console.warn('usePcmPlayer: proc.disconnect', e)
			}
			try {
				ac.close()
			} catch (e) {
				console.warn('usePcmPlayer: ac.close', e)
			}
			procRef.current = null
			acRef.current = null
			queueRef.current = []
		}
	}, [enabled, ws])

	return { lagMs }
}
