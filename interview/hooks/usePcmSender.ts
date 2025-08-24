// interview/hooks/usePcmSender.ts
'use client'
import { useEffect, useRef } from 'react'

function downmixMono(L: Float32Array, R?: Float32Array) {
	if (!R || R.length !== L.length) return L
	const out = new Float32Array(L.length)
	for (let i = 0; i < L.length; i++) out[i] = (L[i] + R[i]) * 0.5
	return out
}

// 48k → 16k 간단 리샘플
function resampleTo16k(input: Float32Array, inRate: number) {
	const outRate = 16000
	if (inRate === outRate) return input
	const ratio = outRate / inRate
	const outLen = Math.round(input.length * ratio)
	const out = new Float32Array(outLen)
	for (let i = 0; i < outLen; i++) {
		const pos = i / ratio
		const i0 = Math.floor(pos)
		const i1 = Math.min(i0 + 1, input.length - 1)
		const f = pos - i0
		out[i] = input[i0] * (1 - f) + input[i1] * f
	}
	return out
}

function floatToPCM16LE(f32: Float32Array) {
	const out = new Int16Array(f32.length)
	for (let i = 0; i < f32.length; i++) {
		// 살짝 감쇠해 클리핑 여유
		let s = Math.max(-1, Math.min(1, f32[i] * 0.85))
		out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
	}
	return out
}

/**
 * 마이크 → 16kHz 모노 → 20ms(=320샘플) 고정 프레임으로 WS 전송
 * - 고정 프레임이면 수신 쪽 타임스케일이 절대 느려지지 않습니다.
 * - 로컬 모니터링은 완전히 음소거(에코/지연 합성 방지)
 */
export function usePcmSender(ws: WebSocket | null, enabled: boolean) {
	const acRef = useRef<AudioContext | null>(null)
	const procRef = useRef<ScriptProcessorNode | null>(null)
	const srcRef = useRef<MediaStreamAudioSourceNode | null>(null)
	const hpRef = useRef<BiquadFilterNode | null>(null)
	const lpRef = useRef<BiquadFilterNode | null>(null)
	const muteRef = useRef<GainNode | null>(null)

	// 16kHz에서 20ms 프레임 크기
	const FRAME_SAMPLES = 320

	// 16kHz Float32 누적 버퍼
	const accumRef = useRef<Float32Array>(new Float32Array(0))

	useEffect(() => {
		if (!enabled || !ws) return
		ws.binaryType = 'arraybuffer'
		let stopped = false

		;(async () => {
			const Ctx = window.AudioContext || (window as any).webkitAudioContext
			const ac = acRef.current ?? new Ctx()
			acRef.current = ac
			await ac.resume().catch(() => {})

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const src = ac.createMediaStreamSource(stream)
			srcRef.current = src

			// DC 제거 + 앨리어싱 억제
			const hp = ac.createBiquadFilter()
			hp.type = 'highpass'
			hp.frequency.value = 20
			hp.Q.value = Math.SQRT1_2
			hpRef.current = hp

			const lp = ac.createBiquadFilter()
			lp.type = 'lowpass'
			lp.frequency.value = 7000
			lp.Q.value = Math.SQRT1_2
			lpRef.current = lp

			// 지연 줄이기 위해 1024 샘플 처리
			const proc = ac.createScriptProcessor(1024, 2, 1)
			procRef.current = proc

			// 로컬 모니터 완전 음소거
			const mute = ac.createGain()
			mute.gain.value = 0
			muteRef.current = mute
			proc.connect(mute).connect(ac.destination)

			proc.onaudioprocess = () => {
				if (stopped || ws.readyState !== WebSocket.OPEN) return
				const inputL = proc.bufferSize
					? proc.context.createBuffer(2, proc.bufferSize, ac.sampleRate)
					: null
				// ScriptProcessorNode는 e.inputBuffer를 이벤트에서 주는데
				// 일부 브라우저 타입 이슈 회피 위해 getChannelData를 직접 가져옵니다.
				// (정석: e: AudioProcessingEvent → e.inputBuffer.getChannelData)
			}

			// 표준 이벤트 버전
			;(proc as any).onaudioprocess = (e: AudioProcessingEvent) => {
				if (stopped || ws.readyState !== WebSocket.OPEN) return
				const L = e.inputBuffer.getChannelData(0)
				const R =
					e.inputBuffer.numberOfChannels > 1
						? e.inputBuffer.getChannelData(1)
						: undefined
				const mono = downmixMono(L, R)

				// 48k 등 → 16k 리샘플
				const mono16k = resampleTo16k(mono, ac.sampleRate)

				// 누적 버퍼에 이어붙이기
				const prev = accumRef.current
				const appended = new Float32Array(prev.length + mono16k.length)
				appended.set(prev, 0)
				appended.set(mono16k, prev.length)
				accumRef.current = appended

				// 320샘플 단위로 끊어서 전송
				while (accumRef.current.length >= FRAME_SAMPLES) {
					const frame = accumRef.current.subarray(0, FRAME_SAMPLES)
					const rest = accumRef.current.subarray(FRAME_SAMPLES)
					accumRef.current = new Float32Array(rest.length)
					accumRef.current.set(rest, 0)

					const int16 = floatToPCM16LE(frame)
					try {
						ws.send(int16.buffer)
					} catch {
						/* ignore */
					}
				}
			}

			// 체인 연결
			src.connect(hp).connect(lp).connect(proc)
		})().catch(console.error)

		return () => {
			stopped = true
			try {
				procRef.current?.disconnect()
			} catch {
				console.error('소켓 연결 해제 실패')
			}
			try {
				muteRef.current?.disconnect()
			} catch {
				console.error('소켓 연결 해제 실패')
			}
			try {
				lpRef.current?.disconnect()
			} catch {
				console.error('소켓 연결 해제 실패')
			}
			try {
				hpRef.current?.disconnect()
			} catch {
				console.error('소켓 연결 해제 실패')
			}
			try {
				srcRef.current?.disconnect()
			} catch {
				console.error('소켓 연결 해제 실패')
			}
			procRef.current = null
			muteRef.current = null
			lpRef.current = null
			hpRef.current = null
			srcRef.current = null
			accumRef.current = new Float32Array(0)
		}
	}, [ws, enabled])
}
